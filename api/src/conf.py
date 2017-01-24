import os

UPLOAD_FOLDER = 'uploads\\'
ALLOWED_EXTENSIONS = {'csv', 'txt'}
ALLOWED_ORIGIN = "http://localhost:4200"
DIR_PATH = os.path.dirname(os.path.realpath(__file__))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_file_path(filename):
    return os.path.join(DIR_PATH, UPLOAD_FOLDER, filename)
