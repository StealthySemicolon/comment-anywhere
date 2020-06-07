from flask import Flask, request, jsonify, g, abort
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
import base64


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
    created = db.Column(db.DateTime)

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
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.String(600), nullable=False)
    created = db.Column(db.DateTime)

    def __init__(self, user_id, content):
        self.user_id = user_id
        self.content = content
        self.created = datetime.now(timezone.utc)

    def __repr__(self):
        return f"<Comment {self.id}>"


class URLComments(db.Model):
    __tablename__ = "urlcomments"

    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey("comments.id"), nullable=False)
    url = db.Column(db.String(2000), nullable=False)

    def __init__(self, comment_id, url):
        self.comment_id = comment_id
        self.url = url

    def __repr__(self):
        return f"<URLComment url={self.url} commentid={self.comment_id}"


class CommentVotes(db.Model):
    __tablename__ = "commentvotes"

    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey("comments.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    direction = db.Column(db.Boolean, nullable=False)
    created = db.Column(db.DateTime, nullable=False)

    def __init__(self, comment_id, user_id, direction):
        self.comment_id = comment_id
        self.user_id = user_id
        self.direction = direction
        self.created = datetime.now(timezone.utc)

    def __repr__(self):
        return (
            f"<Vote direction={self.direction} for={self.comment_id} by={self.user_id}>"
        )


@auth.verify_password
def verify_password(username_or_token, password):
    user: Users = Users.verify_password(username_or_token)
    if not user:
        user: Users = Users.query.filter_by(username=username_or_token).first()
        if not user or not user.check_password(password):
            return False
    g.user = user
    return True


@app.route("/", methods=["GET"])
def root():
    return "<i>Why are you even here?</i>"


@app.route("/api/users", methods=["POST"])
def signup():
    data = request.get_json()
    new_user = Users(data["email"], data["username"], data["password"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"username": new_user.username}), 201


@app.route("/api/token/new", methods=["GET"])
@auth.login_required
def login():
    token = g.user.generate_auth_token(2592000)
    return jsonify({"token": token.decode("ascii"), "duration": 2592000})


@app.route("/api/comments/<url_b64>", methods=["GET"])
def get_comments(url_b64):
    url = base64.b64decode(url_b64)

    comments, _ = (
        db.session.query(Comments, URLComments).filter(URLComments.url == url).all()
    )

    comment: Comments
    results = []

    for comment in comments:
        score = 0
        vote: CommentVotes
        for vote in CommentVotes.query.filter_by(comment_id=comment.id):
            if vote.direction:
                score += 1
            else:
                score -= 1

        results.append(
            {
                "comment_id": comment.id,
                "content": comment.content,
                "username": Users.query.filter_by(id=comment.user_id).first().username,
                "score": score,
            }
        )

    return jsonify(results)


@app.route("/api/comments/<url_b64>", methods=["POST"])
def add_comment(url_b64):
    data = request.get_json()
    user: Users = Users.verify_auth_token(data["token"])
    if user is None:
        abort(401)

    content = data["content"]
    url = base64.decode(url_b64)

    new_comment = Comments(user.id, content)
    db.session.add(new_comment)

    new_url_comment = URLComments(new_comment.id, url)
    db.session.add(new_url_comment)

    db.session.commit()

    return jsonify({"id": new_comment.id}), 201


@app.route("/api/comment/<id>/upvote", methods=["POST"])
def upvote(id, direction):
    data = request.get_json()
    user: Users = Users.verify_auth_token(data["token"])
    if user is None:
        abort(401)

    new_vote = CommentVotes(id, user.id, True)
    db.session.add(new_vote)
    db.session.commit()

    return jsonify({"id": new_vote.id}), 201


@app.route("/api/comment/<id>/upvote", methods=["POST"])
def downvote(id, direction):
    data = request.get_json()
    user: Users = Users.verify_auth_token(data["token"])
    if user is None:
        abort(401)

    new_vote = CommentVotes(id, user.id, False)
    db.session.add(new_vote)
    db.session.commit()

    return jsonify({"id": new_vote.id}), 201


@app.route("/api/comment/<id>/score", methods=["GET"])
def get_score(id):
    score = 0
    vote: CommentVotes
    for vote in CommentVotes.query.filter_by(comment_id=id):
        if vote.direction:
            score += 1
        else:
            score -= 1

    return jsonify({"score": score})


if __name__ == "__main__":
    app.run(host="0.0.0.0")
