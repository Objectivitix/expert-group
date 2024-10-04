from flask import Flask, jsonify, request
import sqlite3
import librosa
from flask_cors import CORS

app = Flask(__name__)  # Create Flask app
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS

# Load up song, segment into beats, and convert to timestamps
audio, sr = librosa.load('../resources/songs/only-alone.mp3')
tempo, beats = librosa.beat.beat_track(y=audio, sr=sr)
beat_times = librosa.frames_to_time(beats, sr=sr) * 1000


# Define the route we'll use to serve beat-times as JSON.
# We're essentially making our own API for client-server comms.
@app.route('/beat-info', methods=['GET'])
def get_beat_info():
    return jsonify({
        'beat_times': beat_times.tolist(),
        'bpm': tempo.tolist(),
    })


# Helper method for connecting to our leaderboard database
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


# Creates and formats our leaderboard database
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            score INTEGER NOT NULL,
            accuracy REAL NOT NULL
        );
    ''')
    conn.commit()
    conn.close()


# The route we'll use to receive and process
# client save score requests
@app.route('/save_score', methods=['POST'])
def save_score():
    # Get client-submitted data
    data = request.json
    username = data.get('username')
    score = data.get('score')
    accuracy = data.get('accuracy')

    # Establish connection with leaderboard DB
    conn = get_db_connection()

    # If user's name exists already, update with their latest stats
    existing_user = conn.execute(
       'SELECT * FROM leaderboard WHERE username = ?', (username,)
    ).fetchone()

    if existing_user:
        conn.execute('''
            UPDATE leaderboard 
            SET score = ?, accuracy = ?
            WHERE username = ?
        ''', (score, accuracy, username))

    # Otherwise, insert new user's stats
    else:
        conn.execute('''
            INSERT INTO leaderboard (username, score, accuracy)
            VALUES (?, ?, ?)
        ''', (username, score, accuracy))

    conn.commit()
    conn.close()

    return jsonify({"message": "Score saved successfully!"}), 201


# Leaderboard information route (client gets info)
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db_connection()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY score DESC, accuracy DESC').fetchall()
    conn.close()
 
    leaderboard_list = [dict(row) for row in leaderboard]
    return jsonify(leaderboard_list), 200


# Driver code - starts the Flask server
if __name__ == '__main__':
    init_db()  # Initialize database when server starts
    app.run(debug=True, port=5000)  # Host server locally, port 5000
