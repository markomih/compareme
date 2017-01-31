from bson import Binary
from bson import ObjectId
from flask import Flask, jsonify, request
from flask import abort
from flask_cors import CORS
from conf import ALLOWED_ORIGIN, SECRET_KEY
from shared.helpers import parse_json
from shared.models import User, Dataset
from shared.services import UserService, DatasetService

app = Flask(__name__)


def get_user():
    token = request.headers.get('Authorization')
    user, user_id = UserService.verify_auth_token(token)
    return user, user_id


# def require_api_token(func):
#     @wraps(func)
#     def check_token(*args, **kwargs):
#         if 'api_session_token' in session:
#             return func(*args, **kwargs)
#         return Response("Access denied")
#
#     return check_token


@app.route('/api/users/register', methods=['POST'])
def register():
    """ Register """
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    if name is None or password is None or email is None:
        return parse_json("missing arguments", False)
    if UserService.does_exist(email):
        return parse_json("existing user", False)

    user = User(name, email, password, [])
    user_id = UserService.create(user)
    token = UserService.generate_auth_token(str(user_id))

    return parse_json({'token': token}, True)


@app.route("/api/users/login", methods=["POST"])
def login():
    """ Login """
    email = request.json.get('email')
    password = request.json.get('password')
    if UserService.check(email, password):
        user, user_id = UserService.get(email)
        token = UserService.generate_auth_token(str(user_id))
        return parse_json({'token': token})
    else:
        return parse_json(False, False)


@app.route("/api/users/logout", methods=["POST"])
def logout():
    """ Logout """
    user, user_id = get_user()
    UserService.generate_auth_token(str(user_id), -1)
    return parse_json(True)


@app.route("/api/users/is_valid", methods=["POST"])
def is_valid_token():
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(False)
    else:
        return parse_json(True)


@app.route('/upload', methods=['POST'])
def upload():
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(401, False)
    if 'file' not in request.files:
        return parse_json(500, False)
    file = request.files['file']
    if file:
        dataset = Dataset(file.filename, DatasetService.get_data(file), Binary(b''))
        DatasetService.create(dataset, user_id)
        return parse_json(dataset.get_dict(True))
    return parse_json('Bad file format', False)


@app.route('/classifier/apply/<classifier>', methods=['POST'])
def apply_classifier(classifier):
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(401, False)

    table_id = request.json.get('table_id')
    removed_labels = request.json.get('removed_labels')
    class_label = request.json.get('class_label')
    score = DatasetService.apply(classifier, ObjectId(table_id), removed_labels, class_label)
    return parse_json(score)


@app.route('/classifier/predict/<classifier>', methods=['POST'])
def predict(classifier):
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(401, False)

    table_id = request.json.get('table_id')
    _predict = request.json.get('predict')  # [['label': 'label_name', 'value': 1212], ...]

    score = DatasetService.predict(classifier, ObjectId(table_id), _predict)
    return parse_json(str(score))


@app.route('/tables', methods=['POST'])
def get_tables():
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(401, False)

    s = DatasetService.get_tables_json(user.data_ids)
    return parse_json(s)


@app.route('/select_table', methods=['POST'])
def select_table():
    table_id = request.json.get('table_id')
    user, user_id = get_user()
    if user is None or user_id is None:
        return parse_json(401, False)
    dataset = DatasetService.get(ObjectId(table_id))
    return parse_json(dataset.get_dict(True))


if __name__ == '__main__':
    app.config['CORS_HEADERS'] = "Content-Type"
    # app.config['CORS_RESOURCES'] = {r"/api/*": {"origins": ALLOWED_ORIGIN}}
    app.config['CORS_RESOURCES'] = {r"/*": {"origins": ALLOWED_ORIGIN}}
    CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGIN}},
         headers="Origin, X-Requested-With, Content-Type, Accept",
         supports_credentials=True)
    app.secret_key = SECRET_KEY
    app.config['SESSION_TYPE'] = 'filesystem'
    app.debug = True
    app.run(host="127.0.0.1", port=5000, threaded=True)
