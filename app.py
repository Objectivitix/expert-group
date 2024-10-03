from flask import Flask, jsonify
import librosa
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS

audio, sr = librosa.load('./resources/only-alone.mp3')  # Update with the correct file path
tempo, beats = librosa.beat.beat_track(y=audio, sr=sr)
beat_times = librosa.frames_to_time(beats, sr=sr) * 1000

# Define the route to serve the beat times as JSON
@app.route('/beat-info', methods=['GET'])
def get_beat_info():
    return jsonify({
        'beat_times': beat_times.tolist(),
        'bpm': tempo.tolist(),
    })

# Add this at the end of the file to start the Flask server
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Start the server on port 5000
