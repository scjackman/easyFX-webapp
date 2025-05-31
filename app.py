from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "This is V2.0 of my web app!"



