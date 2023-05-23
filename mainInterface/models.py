from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ShortVersion(db.Model):
    __tablename__ = 'short_version'
    id = db.Column(db.Integer, primary_key=True)
    short_version = db.Column(db.String(200))
    full_version = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<ShortVersion {self.short_version}>'

    def serialize(self):
        return {
            'full_version': self.full_version,
            'short_version': self.short_version,
        }


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String, unique=False, nullable=True)
    password = db.Column(db.String(120), nullable=False)
    # modded
    last_seen = db.Column(db.DateTime, primary_key=False, default=0)
    profile_image = db.Column(db.LargeBinary, nullable=True)
    # modded
    user_chats = db.relationship('UserChat', back_populates='user')

    short_versions = db.relationship('ShortVersion', backref='user')

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
    __tablename__ = 'chat'
    id = db.Column(db.String(36), primary_key=True)
    unread_count = db.Column(db.Integer, primary_key=False)
    token = db.Column(db.String, nullable=True)

    messages = db.relationship('Message', backref='chat', lazy=True)
    user_chats = db.relationship('UserChat', back_populates='chat')

    def serialize(self):
        return {
            'id': self.id,
            'messages': [message.serialize() for message in self.messages],
            'user_chats': [chat.serialize() for chat in self.user_chats],
            'token': self.token,
        }


class UserChat(db.Model):
    __tablename__ = 'user_chat'
    chat_name = db.Column(db.String(120), default='Новый чат')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), primary_key=True)
    unread_messages_counter = db.Column(db.Integer, default=0)
    last_message = db.Column(db.String, default="Этот чат пока пуст")
    chat_image = db.Column(db.LargeBinary, nullable=True)
    user_chat_color = db.Column(db.String(32), default="#E0C3FC")

    user = db.relationship("User", back_populates="user_chats")
    chat = db.relationship('Chat', back_populates='user_chats')

    def serialize(self):
        return {
            'user_id': self.user_id,
            'chat_id': self.chat_id,
            'chat_name': self.chat_name,

            'user_last_seen': self.user.last_seen,
            'unread_messages_counter': self.unread_messages_counter,
            'chat_image': self.chat_image,
            'last_message': self.last_message,
            'user_chat_color': self.user_chat_color,
        }

    def getName(self):
        return {self.chat_name}

    def getImage(self):
        return {self.chat_image}


message_recipients = db.Table('message_recipients',
                              db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                              db.Column('message_id', db.Integer, db.ForeignKey('message.id'), primary_key=True)
                              )


class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    chat_id = db.Column(db.String(36), db.ForeignKey('chat.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=True)  # Данные файла

    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy=True),
                             lazy='joined')
    recipients = db.relationship('User', secondary=message_recipients,
                                 backref=db.backref('received_messages', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'chat_id': self.chat_id,
            'message': self.message,
            'timestamp': self.timestamp,
            'file_data': self.file_data,
        }
