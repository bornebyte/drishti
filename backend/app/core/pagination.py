from flask import request


def get_pagination():
    page = max(int(request.args.get("page", 1)), 1)
    per_page = min(max(int(request.args.get("per_page", 10)), 1), 100)
    search = request.args.get("search", "").strip()
    return page, per_page, search
