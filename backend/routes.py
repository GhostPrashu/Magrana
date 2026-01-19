from flask import Blueprint, request, jsonify
import random
from models import db, User, Word, Round
from sqlalchemy.sql.expression import func

api_bp = Blueprint('api', __name__)

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # In a real app, verify password hash. For hackathon seed:
    user = User.query.filter_by(username=username).first()
    if user and user.password_hash == password: # Simple check for now
        return jsonify({"message": "Login successful", "user_id": user.id})
    return jsonify({"error": "Invalid credentials"}), 401

@api_bp.route('/game/new', methods=['GET'])
def new_game():
    user_id = request.args.get('user_id')
    # Valid user check omitted for brevity
    
    # Get random word
    word = Word.query.order_by(func.random()).first()
    if not word:
        return jsonify({"error": "No words available"}), 500

    new_round = Round(user_id=user_id, word_id=word.id)
    db.session.add(new_round)
    db.session.commit()

    return jsonify({
        "round_id": new_round.id,
        "word": word.text,
        "scrambled": ''.join(random.sample(word.text, len(word.text))) # valid random shuffle
    })

@api_bp.route('/game/submit', methods=['POST'])
def submit_score():
    data = request.get_json()
    round_id = data.get('round_id')
    score = data.get('score')
    time_taken = data.get('time_taken')
    
    round_entry = Round.query.get(round_id)
    if not round_entry:
        return jsonify({"error": "Round not found"}), 404
        
    round_entry.score = score
    round_entry.time_taken = time_taken
    round_entry.status = 'completed'
    db.session.commit()
    
    return jsonify({"message": "Score submitted", "score": score})

@api_bp.route('/history', methods=['GET'])
def history():
    user_id = request.args.get('user_id')
    rounds = Round.query.filter_by(user_id=user_id, status='completed').order_by(Round.completed_at.desc()).all()
    
    history_data = []
    for r in rounds:
        word = Word.query.get(r.word_id)
        history_data.append({
            "word": word.text,
            "score": r.score,
            "time_taken": r.time_taken,
            "date": r.completed_at.isoformat()
        })
        
    return jsonify(history_data)
