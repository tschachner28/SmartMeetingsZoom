"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    #return render_template('dashboard.html')
    return render_template('index.html')
"""


from flask import Flask, render_template, request, redirect, url_for
from flask import jsonify
import webvtt
from parsing import getAnalytics
import os
import datetime
#from Werkzeug import secure_filename

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
UPLOAD_FOLDER = '.'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'txt', 'vtt'}
filename = ''

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#@app.route('/upload')
#def upload():
#    return render_template('upload.html')

@app.route('/')
def index():
    #return render_template('dashboard.html')
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        if f.filename != '' and allowed_file(f.filename):
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], f.filename))
            global filename
            filename = f.filename
            return redirect('/')
    return render_template('upload.html')

        #        return redirect(url_for('index'))
        #return render_template('index.html')


@app.route("/parse")
def add():
    #transcript = webvtt.read('GMT20210210-231102_Lucah-Ueno.transcript.vtt')
    transcript = webvtt.read(filename)

    participants_speaking_times, num_awkward_silences, participants_sentiments, num_profane_words = getAnalytics(transcript)
    sum_speaking_times = sum(participants_speaking_times.values())
    for participant in participants_speaking_times.keys():
        participants_speaking_times[participant] = int((participants_speaking_times[participant] / sum_speaking_times) * 100)
    print(str(participants_sentiments))
    return jsonify({"participants": list(participants_speaking_times.keys()), "speaking_times": list(participants_speaking_times.values()), "sentiments": list(participants_sentiments.values()), "long_pauses": num_awkward_silences, "num_profane_words": num_profane_words})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

