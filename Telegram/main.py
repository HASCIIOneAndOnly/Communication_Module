import Telegram.Server as tg
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        token = request.form['token']
        # Do something with the token, like save it to a file or database
        return 'Token received: {}'.format(token)
    return render_template('ConnectionPage.html')


@app.route('/guide')
def guide():
    return render_template('Guide.html')


def main():
    tg.tg_setup()


if __name__ == '__main__':
    app.run(debug=True)
    # main()
