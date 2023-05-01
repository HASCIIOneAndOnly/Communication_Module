import psycopg2

# establish a connection to the database
conn = psycopg2.connect(
    host="localhost",
    database="course_project_db",
    user="amepifanov",
    password="fhntv2003",
    port='5050'
)

# create a cursor object
cur = conn.cursor()

# create a table to store messages
cur.execute(
    "CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, sender TEXT, receiver TEXT, message TEXT);"
)

# define a function to send a message


def send_message(sender, receiver, message):
    cur.execute("INSERT INTO messages (sender, receiver, message) VALUES (%s, %s, %s);",
                (sender, receiver, message))
    conn.commit()

# define a function to retrieve messages for a given user


def get_messages(user):
    cur.execute(
        "SELECT sender, message FROM messages WHERE receiver = %s ORDER BY id ASC;", (user,))
    rows = cur.fetchall()
    messages = []
    for row in rows:
        messages.append(f"{row[0]}: {row[1]}")
    return messages


# prompt users to send and receive messages
while True:
    sender = input("Enter your name: ")
    receiver = input(
        "Enter the name of the person you want to send a message to: ")
    message = input("Enter your message: ")
    send_message(sender, receiver, message)
    messages = get_messages(sender)
    print("Messages received:")
    for message in messages:
        print(message)
