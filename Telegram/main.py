import json
import sys

from flask import Flask, render_template, request

import Telegram.Server as tg

app = Flask(__name__)


class TelegramInfo:
    def __init__(self, token):
        self.token = token
        # Когда появится класс пользователя, будем привязывать id
        # к числу привязанных ботов у конкретного пользователя
        self.id = 1


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        token = request.form['token']
        print(token)

        # Попробовать сделать проверку корректности введённого токена
        # bot = telegram.Bot(token=token)
        # try:
        #     bot.get_me()
        #     print("Bot with token", token, "exists.")
        # except telegram.error.TelegramError:
        #     print("Bot with token", TOKEN, "does not exist.")
        #     error = "Bot with token", TOKEN, "does not exist."
        #     return render_template("ConnectionPage.html", error=error)

        created_bot_info = json.dumps(TelegramInfo(token).__dict__)
        original_stdout = sys.stdout
        with open('botsInfo', 'w') as output_file:
            sys.stdout = output_file
            print(created_bot_info)
            sys.stdout = original_stdout
        # Do something with the token, like save it to a file or databaseё
        print("adadas")
        tg.tg_setup()
        return render_template('SuccessfulConnection.html', token=token)
    return render_template('ConnectionPage.html')


@app.route('/guide')
def guide():
    return render_template('Guide.html')


if __name__ == '__main__':
    tg.tg_setup()
    app.run(debug=True)
    # main()
