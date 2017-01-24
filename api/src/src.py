from flask import Flask, jsonify
from flask import request
from flask.ext.cors import CORS
from werkzeug.utils import secure_filename

from conf import allowed_file, ALLOWED_ORIGIN, get_file_path
from processing.DataProcessing import DataProcessing

app = Flask(__name__)
app.config['CORS_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/api/*": {"origins": ALLOWED_ORIGIN}}

CORS(app,
     resources={r"/*": {"origins": ALLOWED_ORIGIN}},
     headers="Origin, X-Requested-With, Content-Type, Accept",
     supports_credentials=True
     )


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


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
