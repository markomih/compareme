import os

from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask.ext.cors import CORS, cross_origin

# Initialize the Flask application
app = Flask(__name__)
# CORS(app, resources=r'*', headers='Content-Type')
# CORS(app, resources=r'/api/*', headers='Content-Type')
app.config['CORS_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/api/*": {"origins": "*"}}
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, headers="Content-Type")


# Route that will process the file upload
# @app.route('/upload/<data>')
# @crossdomain(origin='*')
# def upload(data: str):
#     # Get the name of the uploaded file
#     # file = request.files['file']
#     print(str(data))
#     return jsonify(foo='cross domain ftw')
#

@app.route('/upload', methods=['POST'])
# @cross_origin(origins='http://localhost:3000')
# @crossdomain(origin='*')
def uploadd():
    # Get the name of the uploaded file
    # file = request.files['file']
    print(str("fsdfsd"))
    return jsonify(foo='cross domain ftw')


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
