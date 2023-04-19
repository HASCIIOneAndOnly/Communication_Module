from flask import Flask, render_template

app = Flask(__name__)

# broken commit
@app.route('/')
def index():
    return render_template('chatList.html')


if __name__ == '__main__':
    app.run(debug=True)
