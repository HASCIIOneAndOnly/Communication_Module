import os
import time
from datetime import datetime
from threading import Thread
from uuid import uuid4

import requests
from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, user_logged_in
from flask_socketio import SocketIO, emit

# import telegramBotSource as tg
from models import db, User, Message, Chat, UserChat, ShortVersion

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:liubov1969@localhost:60042/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)
users_sockets = {}
TOKEN = '5717083963:AAHflxPNEMzSklg_hc5Snbs24MQv4aaUyNU'
URL = 'https://api.telegram.org/bot'

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


def get_updates(offset=0):
    result = requests.get(f'{URL}{TOKEN}/getUpdates?offset={offset}').json()
    return result['result']


def run():
    update_id = 0
    if _update := get_updates():
        update_id = _update[-1]['update_id']
    while True:
        time.sleep(2)
        messages = get_updates(update_id)  # Получаем обновления
        print(len(messages))
        for message in messages:
            # Если в обновлении есть ID больше чем ID последнего сообщения, значит пришло новое сообщение
            if update_id < message['update_id']:
                update_id = message['update_id']  # Присваиваем ID последнего отправленного сообщения боту
                if message['message']['text'] == '/start':
                    create_telegram_chat_for_all(message['message']['chat']['first_name'],
                                                 message['message']['chat']['id'])
                else:
                    chat_ids = []
                    with app.app_context():
                        chats = Chat.query.filter_by(token=str(message['message']['chat']['id'])).all()
                        for chat in chats:
                            chat_ids.append(chat.id)
                            # Create a new message object
                            timestamp = datetime.now()
                            new_message = Message(sender_id=-1, chat_id=chat.id,
                                                  message=message['message']['text'], timestamp=timestamp)

                            # Add recipients to the message
                            recipient_ids = [inner_user_chat.user_id for inner_user_chat in chat.user_chats if
                                             inner_user_chat.user_id != -1]
                            print(recipient_ids)
                            for recipient_id in recipient_ids:
                                recipient = User.query.get(recipient_id)
                                new_message.recipients.append(recipient)

                            # Add the message to the database and commit the transaction
                            db.session.add(new_message)
                            db.session.commit()

                for _id in chat_ids:
                    message_data = {
                        'message': message['message']['text'],
                        'sender_id': -1,
                        'chat_id': _id
                    }
                    socketio.emit('new_message', message_data)
            print(message)


@app.route('/getUsers')
@login_required
def getUsers():
    users = User.query.filter(User.id != current_user.id).all()
    serialized_users = [user.serialize() for user in users]
    return jsonify(serialized_users)


@app.route('/mainPage')
@login_required
def mainPage():
    return render_template('mainPage.html', current_user_id=current_user.id)


def create_chats_for_new_user(new_user):
    existing_users = User.query.filter(User.id != new_user.id, User.id != -1).all()
    for existing_user in existing_users:
        chat_id = generate_unique_chat_id()
        chat = Chat(id=chat_id, unread_count=0)
        user1_chat = UserChat(user_id=new_user.id, chat_id=chat_id,
                              chat_name=existing_user.username)
        # user1_chat.user = existing_user
        user2_chat = UserChat(user_id=existing_user.id, chat_id=chat_id,
                              chat_name=new_user.username)
        # user2_chat.user = new_user
        db.session.add(chat)
        db.session.add(user1_chat)
        db.session.add(user2_chat)
    db.session.commit()


@socketio.on('send_message')
def create_message(data):
    # Get data from the request
    chat_id = data.get('chat_id')
    message = data.get('message')

    sender_id = current_user.id

    chat = Chat.query.get(chat_id)
    if chat.token and not data.get('flag_tg'):
        chat_id_telegram = chat.token
        url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id_telegram}&text={message}"
        requests.get(url).json()

    # Create a new message object
    timestamp = datetime.now()
    new_message = Message(sender_id=sender_id, chat_id=chat_id,
                          message=message, timestamp=timestamp)

    recipient_ids = [user_chat.user_id for user_chat in chat.user_chats if user_chat.user_id != sender_id]
    print(chat.user_chats)
    # Add recipients to the message
    for recipient_id in recipient_ids:
        recipient = User.query.get(recipient_id)
        new_message.recipients.append(recipient)
    print(recipient_ids)
    for user_chat in chat.user_chats:
        if len(message) > 32:
            user_chat.last_message = message[:32] + "..."
        else:
            user_chat.last_message = message
        if user_chat.user_id != current_user.id:
            user_chat.unread_messages_counter += 1

    # Add the message to the database and commit the transaction
    db.session.add(new_message)
    db.session.commit()
    message_data = {
        'message': message,
        'sender_id': sender_id,
        'chat_id': chat_id
    }
    emit('new_message', message_data, broadcast=True)
    # Return a response indicating success
    return jsonify({'success': True})


@app.route('/get_last_100_messages', methods=['POST'])
def get_last_100_messages():
    chat_id = request.json.get('chat_id')
    user_id = request.json.get('user_id')
    user_chat = UserChat.query.filter_by(chat_id=chat_id, user_id=user_id).first()
    chat = user_chat.chat
    last_100_messages = Message.query.filter_by(chat_id=chat.id).limit(100).all()
    messages = [message.serialize() for message in last_100_messages]

    user_chat.unread_messages_counter = 0
    print(user_chat.unread_messages_counter)
    db.session.commit()

    return jsonify(messages)


@app.route('/chats')
def get_chats():
    user_chats = UserChat.query.filter_by(user_id=current_user.id).all()
    serialized_chats = [chat.serialize() for chat in user_chats]
    return jsonify(serialized_chats)


@app.route('/get_personal_chat_for_contact', methods=['POST'])
def get_personal_chat_for_contact():
    user_chats = request.json.get('user_chats')
    for user_chat in user_chats:
        current_chat_to_check = Chat.query.get(user_chat['chat_id']).user_chats
        if len(current_chat_to_check) == 2:
            for inside_user_chat in current_chat_to_check:
                if inside_user_chat.serialize()['user_id'] == current_user.id:
                    return inside_user_chat.serialize()
    print("\n\nfailed\n\n")


@app.route('/fastResponses')
def get_fast_responses():
    user = User.query.get(current_user.id)

    fast_responses = [short_version.serialize() for short_version in user.short_versions]
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


# # Update the user's last seen time when they log in
@user_logged_in.connect
def update_last_seen(sender, user, **extra):
    user.last_seen = datetime.utcnow()
    db.session.commit()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def generate_unique_chat_id():
    return str(uuid4())


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        phone_number = request.form['phone_number']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if confirm_password != password:
            error_message = "Пароли не совпадают"
            return render_template('register.html', error_message=error_message)
        if User.query.filter_by(email=email).first():
            error_message = "Пользователь с таким именем уже существует"
            return render_template('register.html', error_message=error_message)

        new_user = User(username=username, phone_number=phone_number, email=email, password=password,
                        last_seen=datetime.now())
        db.session.add(new_user)
        db.session.commit()

        create_chats_for_new_user(new_user)

        return redirect(url_for('login'))

    return render_template('register.html')


def create_telegram_chat_for_all(username, token):
    print(username, token)
    with app.app_context():
        existing_users = User.query.all()
        for existing_user in existing_users:
            chat_id = generate_unique_chat_id()
            chat = Chat(id=chat_id, unread_count=0, token=token)
            user_chat = UserChat(user_id=existing_user.id, chat_id=chat_id, chat_name=username)
            db.session.add(chat)
            db.session.add(user_chat)
        db.session.commit()


def add_bot_user():
    bot_user = User(
        id=-1,
        username="Bot",
        email=str(uuid4()),
        password=str(uuid4()),
        last_seen=datetime.utcnow()
    )
    db.session.add(bot_user)
    db.session.commit()


@app.route('/add_fast_command', methods=['POST'])
def add_version():
    data = request.get_json()

    # Access the short_version and full_version from the data dictionary
    short_version = data.get('short_version')
    full_version = data.get('full_version')

    user = User.query.get(current_user.id)
    short_versions_count = len(user.short_versions)

    if short_versions_count < 5:
        short_version_1 = ShortVersion(short_version=short_version, full_version=full_version, user_id=current_user.id,
                                       id=short_versions_count + current_user.id * 5)

        print(user.username)

        user.short_versions.append(short_version_1)

        db.session.commit()
        return jsonify({'message': 'Version added successfully'})
    else:
        return jsonify({'message': 'Too many fast commands'})


@app.route('/get_short_versions', methods=['GET'])
def get_user_short_versions():
    user = User.query.get(current_user.id)

    short_versions = [short_version.serialize() for short_version in user.short_versions]

    return jsonify(short_versions)


def start_app():
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True, use_reloader=False, port=5700)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # add_bot_user()
    botThread = Thread(target=run)
    botThread.start()
    start_app()
