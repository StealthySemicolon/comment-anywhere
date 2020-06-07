from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPBasicAuth
from datetime import datetime, timezone
from flask import g
from flask_login import UserMixin
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from flask import Blueprint, request, jsonify, g
from datetime import datetime, timezone


db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
auth = HTTPBasicAuth()

app = Flask(__name__)
app.config["SECRET_KEY"] = "tiv1bH-CrjhAXXWcIgcKjqf3uOSBj1Gm"
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://postgres:password@127.0.0.1:5432/commentanywhere"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

bcrypt.init_app(app)

migrate.init_app(app, db)

class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    username = db.Column(db.String(25))
    passhash = db.Column(db.LargeBinary(60))
    created = db.Column(db.DateTime())

    def __init__(self, email, username, password, created):
        self.email = email
        self.username = username
        self.passhash = bcrypt.generate_password_hash(password, 10)
        self.created = created

    def check_password(self, password):
        return bcrypt.check_password_hash(self.passhash, password)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config["SECRET_KEY"], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config["SECRET_KEY"])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        
        user = Users.query.get(data['id'])
        return user

    def __repr__(self):
        return f"<User {self.id}>"

@auth.verify_password
def verify_password(username_or_token, password):
    user:Users = Users.verify_password(username_or_token)
    if not user:
        user:Users = Users.query.filter_by(username=username_or_token).first()
        if not user or not user.check_password(password):
            return False
    
    g.user = user
    return True

@app.route("/")
def hello():
    return "Hello World!"


@app.route("/api/users", methods=["POST"])
def signup():
    data = request.json
    new_user = Users(data["email"], data["username"], data["password"], datetime.now(timezone.utc))
    db.session.add(new_user)
    db.session.commit()

    return jsonify({ 'username': new_user.username }), 201

@app.route("/api/token")
@auth.login_required
def login():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})