from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


employees_bp = Blueprint("employees", __name__)


@employees_bp.get("/employees")
@current_user_required
@permission_required("employee.read")
def list_employees():
    page, per_page, search = get_pagination()
    zone_id = request.args.get("zone_id")
    items = services()["store"].list(
        "employees",
        filters={"assigned_zone_id": zone_id},
        search=search,
        search_fields=["name", "employee_code", "department", "designation"],
    )
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@employees_bp.get("/employees/<employee_id>")
@current_user_required
@permission_required("employee.read")
def employee_detail(employee_id: str):
    store = services()["store"]
    employee = store.get("employees", employee_id)
    if not employee:
        return api_response(success=False, message="Employee not found.", status=HTTPStatus.NOT_FOUND)
    incidents = store.list("incidents", filters={"employee_id": employee_id})
    reports = store.list("reports", filters={"employee_id": employee_id})
    return api_response(data={**employee, "incidents": incidents, "reports": reports})


@employees_bp.post("/employees")
@current_user_required
@permission_required("employee.manage")
def create_employee():
    payload = request.get_json(force=True, silent=True) or {}
    existing = [
        employee
        for employee in services()["store"].list("employees")
        if employee["employee_code"].lower() == payload.get("employee_code", "").strip().lower()
    ]
    if existing:
        return api_response(
            success=False,
            message="An employee with this employee ID already exists.",
            status=HTTPStatus.CONFLICT,
        )
    employee = services()["store"].create(
        "employees",
        {
            "employee_code": payload.get("employee_code", "").strip(),
            "name": payload.get("name", "").strip(),
            "department": payload.get("department", "").strip(),
            "designation": payload.get("designation", "").strip(),
            "assigned_zone_id": payload.get("assigned_zone_id"),
            "profile_photo_media_id": payload.get("profile_photo_media_id"),
            "phone": payload.get("phone", "").strip(),
            "emergency_contact": payload.get("emergency_contact", "").strip(),
            "preferred_language": payload.get("preferred_language", "हिन्दी"),
            "join_date": payload.get("join_date"),
            "active": True,
        },
    )
    services()["store"].add_audit_log(request.current_user_id, "create", "employee", employee["id"], employee)
    return api_response(data=employee, message="Employee created.", status=HTTPStatus.CREATED)


@employees_bp.patch("/employees/<employee_id>")
@current_user_required
@permission_required("employee.manage")
def update_employee(employee_id: str):
    payload = request.get_json(force=True, silent=True) or {}
    if payload.get("employee_code"):
        duplicate = [
            employee
            for employee in services()["store"].list("employees")
            if employee["id"] != employee_id
            and employee["employee_code"].lower() == payload["employee_code"].strip().lower()
        ]
        if duplicate:
            return api_response(
                success=False,
                message="An employee with this employee ID already exists.",
                status=HTTPStatus.CONFLICT,
            )
    employee = services()["store"].update("employees", employee_id, payload)
    if not employee:
        return api_response(success=False, message="Employee not found.", status=HTTPStatus.NOT_FOUND)
    services()["store"].add_audit_log(request.current_user_id, "update", "employee", employee_id, payload)
    return api_response(data=employee, message="Employee updated.")


@employees_bp.delete("/employees/<employee_id>")
@current_user_required
@permission_required("employee.manage")
def delete_employee(employee_id: str):
    employee = services()["store"].soft_delete("employees", employee_id)
    if not employee:
        return api_response(success=False, message="Employee not found.", status=HTTPStatus.NOT_FOUND)
    services()["store"].add_audit_log(request.current_user_id, "delete", "employee", employee_id)
    return api_response(message="Employee deactivated.")
