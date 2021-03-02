import webvtt
import datetime
from textblob import TextBlob



def getAnalytics(transcript):
    participants_speaking_times = {}
    num_awkward_silences = 0 # 10+ seconds of silence
    #current_start_time = datetime.datetime.strptime('00:00:03.629', '%H:%M:%S.%f') # initialize to random value
    current_end_time = None # initialize to random value
    question_words = ['who', 'who\'s', 'who\'d', 'who\'ve', 'where', 'where\'s', 'where\'d', 'where\'ve',
                            'what', 'what\'s', 'what\'ve', 'what\'d', 'why', 'why\'s', 'why\'ve', 'why\'d',
                            'how', 'how\'s', 'how\'d', 'how\'ve', 'when', 'when\'s', 'which', 'whose', 'whom']
    num_question_words = 0
    participants_polarity_subjectivity = {} # key: participant. value: [sum_polarity, sum_subjectivity, total_lines]

    for line in transcript:
        current_start_time = datetime.datetime.strptime(line.start, '%H:%M:%S.%f')  # datetime.datetime.strptime(line[0:12], '%H:%M:%S.%f')
        if current_end_time != None and current_start_time - current_end_time > datetime.timedelta(seconds=10): # (current start) - (previous end)
            num_awkward_silences += 1
        current_end_time = datetime.datetime.strptime(line.end, '%H:%M:%S.%f')
        current_speaking_time = current_end_time - current_start_time
        participant_end_index = line.text.find(': ')
        if participant_end_index == -1:
            continue
        current_participant = line.text[0:participant_end_index]
        if current_participant in participants_speaking_times.keys():
            participants_speaking_times[current_participant] += current_speaking_time.total_seconds()
        else:
            participants_speaking_times[current_participant] = current_speaking_time.total_seconds()
        #current_speaking_time = datetime.datetime.strptime()
        #print(line)
        #for word in question_words:
        # Sentiment analysis
        testimonial = TextBlob(line.text[participant_end_index + 2:])
        if current_participant in participants_polarity_subjectivity.keys():
            participants_polarity_subjectivity[current_participant][0] += testimonial.sentiment.polarity
            participants_polarity_subjectivity[current_participant][1] += testimonial.sentiment.subjectivity
            participants_polarity_subjectivity[current_participant][2] += 1
        else:
            participants_polarity_subjectivity[current_participant] = [testimonial.sentiment.polarity, testimonial.sentiment.subjectivity, 1]
    participants_average_sentiments = {} # key: participant. value: [average_polarity, average_subjectivity]
    for participant in participants_polarity_subjectivity.keys():
        participants_average_sentiments[participant] = [participants_polarity_subjectivity[participant][0]/participants_polarity_subjectivity[participant][2],
                                                        participants_polarity_subjectivity[participant][1]/participants_polarity_subjectivity[participant][2]]

    return participants_speaking_times, num_awkward_silences, participants_average_sentiments

if __name__ == '__main__':
    #transcript = webvtt.read('GMT20190928-005727_Tommy-Gaes.transcript.vtt')
    transcript = webvtt.read('GMT20210210-231102_Lucah-Ueno.transcript.vtt')
    participants_speaking_times, num_awkward_silences, participants_average_sentiments = getAnalytics(transcript)
    print(str(participants_speaking_times))
    print(str(num_awkward_silences))
    print(str(participants_average_sentiments))
    #print(str(num_question_words))