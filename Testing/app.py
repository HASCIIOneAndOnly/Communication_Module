from flask import Flask, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_socketio import SocketIO, emit
from models import db, User, Message, Chat, UserChat
from sqlalchemy import or_
import datetime
import os
from uuid import uuid4

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://amepifanov:fhntv2003@localhost:5050/course_project_db'
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)
users_sockets = {}

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


def generate_unique_chat_id():
    return str(uuid4())


def create_chats_for_new_user(new_user):
    existing_users = User.query.filter(User.id < new_user.id).all()
    for user in existing_users:
        if user.id != new_user.id:
            chat_id = generate_unique_chat_id()
            chat = Chat(id=chat_id)
            user1_chat = UserChat(user_id=new_user.id, chat_id=chat_id)
            user2_chat = UserChat(user_id=user.id, chat_id=chat_id)

            db.session.add(chat)
            db.session.add(user1_chat)
            db.session.add(user2_chat)

    db.session.commit()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/')
def home():
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if User.query.filter_by(username=username).first():
            flash("Пользователь с таким именем уже существует")
            return redirect(url_for('register'))

        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()

        create_chats_for_new_user(new_user)  # Добавьте эту строку

        flash("Успешная регистрация")
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            login_user(user)
            return redirect(url_for('user_list'))
        else:
            flash("Неправильное имя пользователя или пароль")

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/user_list')
@login_required
def user_list():
    users = User.query.all()
    user_chats = UserChat.query.filter_by(user_id=current_user.id).all()
    chat_usernames = {}
    for user_chat in user_chats:
        recipient_id = UserChat.query.filter(UserChat.chat_id == user_chat.chat_id,
                                             UserChat.user_id != current_user.id).first().user_id
        recipient = User.query.get(recipient_id)
        chat_usernames[user_chat.chat_id] = recipient.username

    return render_template('user_list.html', users=users, chat_usernames=chat_usernames)


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


@app.route('/chat/<string:chat_id>')
@login_required
def chat_view(chat_id):
    user_chat = UserChat.query.filter_by(user_id=current_user.id, chat_id=chat_id).first()
    if not user_chat:
        return redirect(url_for('user_list'))

    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp).all()
    recipient_id = UserChat.query.filter(UserChat.chat_id == chat_id,
                                         UserChat.user_id != current_user.id).first().user_id
    recipient = User.query.get(recipient_id)

    return render_template('chat.html', messages=messages, recipient=recipient, chat_id=chat_id)


# @app.route('/send_message/<string:chat_id>', methods=['POST'])
# @login_required
# def send_message(chat_id):
#     user_chat = UserChat.query.filter_by(user_id=current_user.id, chat_id=chat_id).first()
#
#     if not user_chat:
#         return redirect(url_for('user_list'))
#
#     recipient = [user for user in [uc.user for uc in user_chat.chat.user_chats] if user != current_user][0]
#
#     message_text = request.form['message']
#     new_message = Message(sender_id=current_user.id, recipient_id=recipient.id,
#                           chat_id=chat_id, message=message_text,
#                           timestamp=datetime.datetime.now())
#     db.session.add(new_message)
#     db.session.commit()
#     return redirect(url_for('chat_view', chat_id=chat_id))


@socketio.on('send_message')
@login_required
def handle_send_message(data):
    message = data['message']
    chat_id = data['chat_id']
    recipient_id = data['recipient_id']
    new_message = Message(sender_id=current_user.id, recipient_id=recipient_id, chat_id=chat_id,
                          message=message, timestamp=datetime.datetime.now())
    db.session.add(new_message)
    db.session.commit()

    message_data = {
        'username': current_user.username,
        'message': message,
        'timestamp': new_message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    }

    recipient_socket = users_sockets.get(recipient_id)
    if recipient_socket:
        emit('new_message', message_data, broadcast=True)

    emit('new_message', message_data, broadcast=True)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True, port=5600)
