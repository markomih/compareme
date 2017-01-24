import json
from functools import wraps


def validate_json(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            print(e)
            return parse_json([], False)

    return wrap


def parse_json(data_list, success=True) -> str:
    try:
        return json.dumps({'data': data_list, 'success': success})
    except Exception as e:
        print(e)
        return json.dumps({'data': [], 'success': False})
