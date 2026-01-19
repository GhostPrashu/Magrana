from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes import api_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
db.init_app(app)

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "Magrana Backend Running"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
