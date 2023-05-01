from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    user_chats = db.relationship('UserChat', back_populates='user')

    def __repr__(self):
        return f'<User {self.username}>'

    @property
    def is_active(self):
        return True


class Chat(db.Model):
    id = db.Column(db.String(36), primary_key=True)  # Замените строковый тип на числовой
    messages = db.relationship('Message', backref='chat', lazy=True)
    user_chats = db.relationship('UserChat', back_populates='chat')


class UserChat(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), primary_key=True)
    user = db.relationship("User", back_populates="user_chats")
    chat = db.relationship("Chat", back_populates="user_chats")


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy=True))
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref=db.backref('received_messages', lazy=True))
