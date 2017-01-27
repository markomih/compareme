import os
from base64 import b64encode

DATABASE = {
    'NAME': 'compareme',
    'ADDRESS': 'mongodb://root:makijecar@ds129459.mlab.com:29459/compareme'
}
SECRET_KEY = b64encode(os.urandom(24)).decode('utf-8')
UPLOAD_FOLDER = 'uploads\\'
ALLOWED_EXTENSIONS = {'csv', 'txt'}
ALLOWED_ORIGIN = "*"
# ALLOWED_ORIGIN = "http://localhost:4200"
DIR_PATH = os.path.dirname(os.path.realpath(__file__))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_file_path(filename):
    return os.path.join(DIR_PATH, UPLOAD_FOLDER, filename)
