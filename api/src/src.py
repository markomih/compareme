from flask import Flask, jsonify, abort, request, session
from flask import Response
from flask.ext.cors import CORS
from werkzeug.utils import secure_filename
from functools import wraps

from conf import allowed_file, ALLOWED_ORIGIN, get_file_path, SECRET_KEY
from processing.DataProcessing import DataProcessing
from shared.helpers import validate_json, parse_json
from shared.models import User
from shared.services import UserService

app = Flask(__name__)


def require_api_token(func):
    @wraps(func)
    def check_token(*args, **kwargs):
        if 'api_session_token' in session:
            return func(*args, **kwargs)
        return Response("Access denied")

    return check_token


@validate_json
@app.route('/api/users/register', methods=['POST'])
def register():
    """ Register """
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    if name is None or password is None or email is None:
        abort(400)  # missing arguments
    if UserService.does_exist(email):
        abort(400)  # existing user

    user = UserService.create(User(name, email, password, []))
    session['api_session_token'] = UserService.generate_auth_token()

    return parse_json(user.get_dict(False))


@app.route("/api/users/login", methods=["POST"])
def login():
    """ Login """
    # name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    if UserService.check(email, password):
        user = UserService.get(email)
        session['user'] = user.get_dict(False)
        session['api_session_token'] = UserService.generate_auth_token()
    return parse_json(True)


@app.route("/api/users/logout", methods=["POST"])
def logout():
    """ Logout """
    session['user'] = None
    session['api_session_token'] = None
    return parse_json(True)


# @validate_json
@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'Invalid credentials'
        file = request.files['file']
        if file.filename == '':
            return 'Invalid credentials'
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = get_file_path(filename)
            file.save(path)
            s = DataProcessing.get_data(path)
            return s
    return jsonify('Not supported')


@validate_json
@app.route('/', methods=['POST'])
@require_api_token
def hello_world():
    return parse_json(session['user'])


if __name__ == '__main__':
    app.config['CORS_HEADERS'] = "Content-Type"
    # app.config['CORS_RESOURCES'] = {r"/api/*": {"origins": ALLOWED_ORIGIN}}
    app.config['CORS_RESOURCES'] = {r"*": {"origins": '*'}}
    CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGIN}},
         headers="Origin, X-Requested-With, Content-Type, Accept",
         supports_credentials=True)
    app.secret_key = SECRET_KEY
    app.config['SESSION_TYPE'] = 'filesystem'
    app.debug = True
    app.run(host="127.0.0.1", port=5000, threaded=True)
    app.run()
