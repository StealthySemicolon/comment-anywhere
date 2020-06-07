from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPBasicAuth
from datetime import datetime, timezone
from itsdangerous import (
    TimedJSONWebSignatureSerializer as Serializer,
    BadSignature,
    SignatureExpired,
)


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
    username = db.Column(db.String(25), index=True, nullable=False, unique=True)
    passhash = db.Column(db.LargeBinary(60), nullable=False)
    created = db.Column(db.DateTime())

    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.passhash = bcrypt.generate_password_hash(password, 10)
        self.created = datetime.now(timezone.utc)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.passhash, password)

    def generate_auth_token(self, expiration=3600):
        s = Serializer(app.config["SECRET_KEY"], expires_in=expiration)
        return s.dumps({"id": self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config["SECRET_KEY"])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None

        user = Users.query.get(data["id"])
        return user

    def __repr__(self):
        return f"<User {self.id}>"


class Comments(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(600), nullable=False)
    created = db.Column(db.DateTime())

    def __init__(self, content):
        self.content = content
        self.created = datetime.now(timezone.utc)


def __repr__(self):
    return f"<Comment {self.id}>"


@auth.verify_password
def verify_password(username_or_token, password):
    user: Users = Users.verify_password(username_or_token)
    if not user:
        user: Users = Users.query.filter_by(username=username_or_token).first()
        if not user or not user.check_password(password):
            return False
    g.user = user
    return True


@app.route("/api/users", methods=["POST"])
def signup():
    data = request.json
    new_user = Users(data["email"], data["username"], data["password"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"username": new_user.username}), 201


@app.route("/api/token")
@auth.login_required
def login():
    token = g.user.generate_auth_token(600)
    return jsonify({"token": token.decode("ascii"), "duration": 600})
