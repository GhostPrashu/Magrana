from app import app
from models import db, User, Word

def seed_data():
    with app.app_context():
        db.create_all()
        
        # Check if data exists
        if User.query.first():
            print("Data already seeded.")
            return

        # Create Users
        # Pre-assigned user ids/passwords as mentioned in requirements
        users = [
            User(username="user1", password_hash="pass1"),
            User(username="user2", password_hash="pass2"),
            User(username="user3", password_hash="pass3"),
            User(username="user4", password_hash="pass4"),
        ]
        
        db.session.add_all(users)
        
        # Create Words
        words_data = [
            ("react", 1),
            ("python", 1),
            ("coding", 2),
            ("hacker", 2),
            ("magrana", 3),
            ("algorithm", 3),
            ("database", 2),
            ("interface", 3)
        ]
        
        for w, diff in words_data:
            db.session.add(Word(text=w, difficulty=diff))
            
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
