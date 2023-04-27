from flask import Flask, request, render_template, redirect, url_for, flash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_socketio import SocketIO, emit
from models import db, User, Message
import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://amepifanov:fhntv2003@localhost:5050/course_project_db'
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


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
            return redirect(url_for('chat'))
        else:
            flash("Неправильное имя пользователя или пароль")

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/chat')
@login_required
def chat():
    messages = Message.query.order_by(Message.timestamp).all()
    return render_template('chat.html', messages=messages)


@app.route('/send_message', methods=['POST'])
@login_required
def send_message():
    message_text = request.form['message']
    new_message = Message(user_id=current_user.id,
                          message=message_text, timestamp=datetime.datetime.now())
    db.session.add(new_message)
    db.session.commit()
    return redirect(url_for('chat'))


@socketio.on('send_message')
def handle_send_message(data):
    message_text = data['message']
    new_message = Message(user_id=current_user.id, message=message_text, timestamp=datetime.datetime.now())
    db.session.add(new_message)
    db.session.commit()
    emit('new_message', {'user': current_user.username, 'message': message_text, 'timestamp': new_message.timestamp.strftime('%Y-%m-%d %H:%M:%S')}, broadcast=True)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
