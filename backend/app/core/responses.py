from flask import jsonify


def api_response(*, success=True, data=None, message="", pagination=None, status=200):
    payload = {
        "success": success,
        "data": data,
        "message": message,
        "pagination": pagination,
    }
    return jsonify(payload), status
