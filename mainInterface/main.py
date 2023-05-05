from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_socketio import SocketIO, emit

import json

import os
from uuid import uuid4

from models import db, User, Message, Chat, UserChat

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:liubov1969@localhost:60042/postgres'
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)
users_sockets = {}

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


@app.route('/getUsers')
@login_required
def getUsers():
    users = User.query.filter(User.id != current_user.id).all()
    serialized_users = [user.serialize() for user in users]
    return jsonify(serialized_users)


@app.route('/mainPage')
@login_required
def mainPage():
    return render_template('mainPage.html')


def createChatsForNewUser(new_user):
    existing_users = User.query.filter(User.id != new_user.id).all()
    for user in existing_users:
        chat_id = generate_unique_chat_id()
        chat = Chat(id=chat_id)
        user1_chat = UserChat(user_id=new_user.id, chat_id=chat_id,
                              chat_name=user.username, last_message="Этот чат пока пуст")
        user2_chat = UserChat(user_id=user.id, chat_id=chat_id,
                              chat_name=new_user.username, last_message="Этот чат пока пуст")

        db.session.add(chat)
        db.session.add(user1_chat)
        db.session.add(user2_chat)

    db.session.commit()


@app.route('/send-message', methods=['POST'])
def send_message():
    chat_id = request.json['chat_id']
    message = request.json['message']
    # Find the chat object in the database
    chat = Chat.query.get(chat_id)

    # Create a new message object and add it to the chat object's messages field
    new_message = Message(sender=current_user, chat=chat, message=message, timestamp=datetime.utcnow())
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'success': True})


@app.route('/get_last_100_messages', methods=['POST'])
def get_last_100_messages():
    chat_id = request.json.get('chat_id')
    user_id = request.json.get('user_id')
    user_chat = UserChat.query.filter_by(chat_id=chat_id, user_id=user_id).first()
    chat = user_chat.chat
    last_100_messages = Message.query.filter_by(chat_id=chat.id).limit(100).all()
    messages = [message.serialize() for message in last_100_messages]
    return jsonify(messages)


@app.route('/chats')
def get_chats():
    user_chats = UserChat.query.filter_by(user_id=current_user.id).all()
    serialized_chats = [chat.serialize() for chat in user_chats]
    return jsonify(serialized_chats)


@app.route('/fastResponses')
def get_fast_responses():
    # Here you would retrieve the chat data from your database or other data source
    # and format it as a list of dictionaries
    fast_responses = [
        {
            "short_version": "/Привет",
            "full_version": "Добрый день! Рады Вас приветствовать !"
        },
        {
            "short_version": "/Цены",
            "full_version": "Дорожный знак: 20 000 руб. "
                            "Автомобильный номер: 5 000 руб."
        },
        {
            "short_version": "/Послать на ...",
            "full_version": "Прошу прощения, но наша компания не в силах помочь Вам с "
                            "исполнением озвученных пожеланий."
        }
    ]
    # Return the chat data as a JSON object
    return jsonify(fast_responses)


@socketio.on('connect')
def connect():
    pass


@socketio.on('connect')
@login_required
def on_connect():
    users_sockets[current_user.id] = request.sid
    print(f"Connected: {current_user.username}, sid: {request.sid}")


@socketio.on('disconnect')
@login_required
def handle_disconnect():
    users_sockets.pop(current_user.id, None)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and user.password == password:
            login_user(user)
            return redirect(url_for('mainPage'))
        else:
            error_message = 'Пользователя с таким email и паролем не существует'
            return render_template('login.html', error_message=error_message)
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/')
def home():
    return redirect(url_for('login'))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def generate_unique_chat_id():
    return str(uuid4())


# def create_chats_for_new_user(new_user):
#     existing_users = User.query.filter(User.id < new_user.id).all()
#     for user in existing_users:
#         if user.id != new_user.id:
#             chat_id = generate_unique_chat_id()
#             chat = Chat(id=chat_id)
#             user1_chat = UserChat(user_id=new_user.id, chat_id=chat_id)
#             user2_chat = UserChat(user_id=user.id, chat_id=chat_id)
#
#             db.session.add(chat)
#             db.session.add(user1_chat)
#             db.session.add(user2_chat)
#
#     db.session.commit()


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        phone_number = request.form['phone_number']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if confirm_password != password:
            flash("Пароли не совпадают")
            return redirect(url_for('register'))
        if User.query.filter_by(email=email).first():
            flash("Пользователь с таким именем уже существует")
            return redirect(url_for('register'))

        new_user = User(username=username, phone_number=phone_number, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        createChatsForNewUser(new_user)

        return redirect(url_for('login'))

    return render_template('register.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True, port=5700)
