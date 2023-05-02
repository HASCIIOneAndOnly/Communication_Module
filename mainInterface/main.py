from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_socketio import SocketIO, emit

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


# @app.route('/', methods=['GET', 'POST'])
# def index():
#     return render_template('mainPage.html')


@app.route('/user_list')
# @login_required
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


@app.route('/chats')
def get_chats():
    # Here you would retrieve the chat data from your database or other data source
    # and format it as a list of dictionaries
    chat_data = [
        {
            "name": "Alex Smith",
            "profile_image": "../static/img/profile-1.png",
            "time": "06:04 PM",
            'messages': ['How to make website using html and css?'],
            "unreadCount": 1,
            'last_seen': '10 minutes ago',
        },
        {
            "name": "John Doe",
            "profile_image": "static/img/profile-2.png",
            "time": "08:30 AM",
            'messages': ['How to make website using html and css?'],
            "unreadCount": 0,
            'last_seen': '10 minutes ago',
        },
        {
            "name": "Jane Doe",
            "profile_image": "../static/img/profile-3.png",
            "time": "Yesterday",
            'messages': ['How to make website using html and css?'],
            "unreadCount": 2,
            'last_seen': '10 minutes ago',
        }
    ]
    # Return the chat data as a JSON object
    return jsonify(chat_data)


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


@app.route('/')
def home():
    return redirect(url_for('login'))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


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
            return redirect('register')
        if User.query.filter_by(email=email).first():
            flash("Пользователь с таким именем уже существует")
            return redirect(url_for('register'))

        new_user = User(username=username, phone_number=phone_number, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        create_chats_for_new_user(new_user)  # Добавьте эту строку

        flash("Успешная регистрация")
        return redirect(url_for('login'))

    return render_template('register.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True, port=5700)
    # app.run(debug=True, port=60000)
