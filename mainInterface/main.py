from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('mainPage.html')


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


if __name__ == '__main__':
    app.run(debug=True, port=60000)
