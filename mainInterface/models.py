from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String, unique=False, nullable=True)
    password = db.Column(db.String(120), nullable=False)
    # modded
    last_seen = db.Column(db.Integer, primary_key=False, default=0)
    profile_image = db.Column(db.String(120), nullable=True)
    # modded
    user_chats = db.relationship('UserChat', back_populates='user')

    def __repr__(self):
        return f'<User {self.username}>'

    @property
    def is_active(self):
        return True

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone_number': self.phone_number,
            'last_seen': self.last_seen,
            'profile_image': self.profile_image,
            'user_chats': [chat.serialize() for chat in self.user_chats],
            'is_active': self.is_active,
        }


class Chat(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    messages = db.relationship('Message', backref='chat', lazy=True)
    user_chats = db.relationship('UserChat', back_populates='chat')
    # modded
    unread_count = db.Column(db.Integer, primary_key=False)

    # modded
    # chat_image = db.Column(db.String(120), nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'messages': [message.serialize() for message in self.messages],
        }


class UserChat(db.Model):
    chat_name = db.Column(db.String(120), default='Новый чат')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), primary_key=True)
    user = db.relationship("User", back_populates="user_chats")
    chat = db.relationship("Chat", back_populates="user_chats")
    unread_messages_counter = db.Column(db.Integer, default=0)

    def serialize(self):
        return {
            'user_id': self.user_id,
            'chat_id': self.chat_id,
            'chat_name': self.chat_name,

            'chat': self.chat.serialize(),
            'unread_messages_counter': self.unread_messages_counter,
        }


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy=True))
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref=db.backref('received_messages', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'chat_id': self.chat_id,
            'message': self.message,
            'timestamp': self.timestamp,
            'sender': self.sender.serialize(),
            'recipient': self.recipient.serialize(),
        }
