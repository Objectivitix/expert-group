from flask import Flask, jsonify, request
import sqlite3
import librosa
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS

audio, sr = librosa.load('C:/Users/Sky/expert-group/resources/resources_only-alone.mp3')

tempo, beats = librosa.beat.beat_track(y=audio, sr=sr) 
beat_times = librosa.frames_to_time(beats, sr=sr) * 1000  
# Define the route to serve the beat times as JSON
@app.route('/beat-info', methods=['GET'])
def get_beat_info():
    return jsonify({
        'beat_times': beat_times.tolist(),
        'bpm': tempo.tolist(),
    })







#sql
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

#leaderboard!!!
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            gold INTEGER NOT NULL,
            green INTEGER NOT NULL,
            purple INTEGER NOT NULL,
            accuracy REAL NOT NULL
        );
    ''')
    conn.commit()
    conn.close()

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    username = data.get('username')
    gold = data.get('gold')
    green = data.get('green')
    purple = data.get('purple')
    accuracy = data.get('accuracy')

    conn = get_db_connection()
    conn.execute('''
        INSERT INTO leaderboard (username, gold, green, purple, accuracy)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, gold, green, purple, accuracy))
    conn.commit()
    conn.close()

    return jsonify({"message": "Score saved successfully!"}), 201


@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db_connection()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY accuracy DESC').fetchall()
    conn.close()
  
    leaderboard_list = [dict(row) for row in leaderboard]
    return jsonify(leaderboard_list), 200

# Add this at the end of the file to start the Flask server
if __name__ == '__main__':
    init_db()  # Initialize the database when the server starts
    app.run(debug=True, port=5000)