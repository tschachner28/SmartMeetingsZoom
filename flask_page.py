from flask import Flask

app = Flask(__name__)

@app.route('/')
def flask_page():
    return 'Zoom Meetings Analytics Dashboard'