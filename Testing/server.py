import socket
import threading
import psycopg2

# establish a connection to the database
conn = psycopg2.connect(
    host="localhost",
    database="course_project_db",
    user="amepifanov",
    password="fhntv2003",
    port="5050"
)

# create a cursor object
cur = conn.cursor()

# create a table to store messages
cur.execute(
    "CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, sender TEXT, message TEXT);"
)

# create a socket object
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# set the host and port number for the server
host = "localhost"
port = 5051

# bind the socket object to the host and port number
server_socket.bind((host, port))

# listen for incoming connections
server_socket.listen()

# create a list to hold all connected clients
clients = []

# define a function to handle client connections


def handle_client(client_socket, client_address):
    print(f"New connection from {client_address}")

    # add the client to the list of connected clients
    clients.append(client_socket)

    # prompt the client to enter their name
    client_socket.send("Enter your name: ".encode("utf-8"))
    name = client_socket.recv(1024).decode("utf-8").strip()
    print(f"{name} has joined the chat")

    # continuously receive messages from the client
    while True:
        try:
            # receive the message from the client
            message = client_socket.recv(1024).decode("utf-8")
            print(f"{name}: {message}")

            # insert the message into the database
            cur.execute(
                "INSERT INTO messages (sender, message) VALUES (%s, %s);", (name, message))
            conn.commit()

            # broadcast the message to all connected clients
            for c in clients:
                if c != client_socket:
                    c.send(f"{name}: {message}".encode("utf-8"))
        except:
            # if an error occurs, remove the client from the list of connected clients
            clients.remove(client_socket)
            print(f"{name} has left the chat")
            for c in clients:
                c.send(f"{name} has left the chat".encode("utf-8"))
            break


# continuously accept incoming connections from clients
while True:
    client_socket, client_address = server_socket.accept()
    client_thread = threading.Thread(
        target=handle_client, args=(client_socket, client_address))
    client_thread.start()
