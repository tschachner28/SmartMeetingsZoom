"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    #return render_template('dashboard.html')
    return render_template('index.html')
"""


from flask import Flask, render_template
from flask import jsonify
import webvtt
from parsing import getAnalytics
import datetime


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True



@app.route('/')
def index():
    #return render_template('dashboard.html')
    return render_template('index.html')

@app.route("/parse")
def add():
    transcript = webvtt.read('GMT20210210-231102_Lucah-Ueno.transcript.vtt')
    participants_speaking_times, num_awkward_silences, participants_sentiments = getAnalytics(transcript)
    sum_speaking_times = sum(participants_speaking_times.values())
    for participant in participants_speaking_times.keys():
        participants_speaking_times[participant] = int((participants_speaking_times[participant] / sum_speaking_times) * 100)
    print(str(participants_sentiments))
    return jsonify({"participants": list(participants_speaking_times.keys()), "speaking_times": list(participants_speaking_times.values()), "sentiments": list(participants_sentiments.values()), "long_pauses": num_awkward_silences})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
