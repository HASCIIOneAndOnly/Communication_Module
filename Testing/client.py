import socket
import threading

# create a socket object
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# set the host and port number for the server
host = "localhost"
port = 5051

# connect to the server
client_socket.connect((host, port))

# prompt the user to enter their name
name = input("Enter your name: ")
client_socket.send(name.encode("utf-8"))

# define a function to continuously receive messages from the server


def receive_messages():
    while True:
        try:
            message = client_socket.recv(1024).decode("utf-8")
            print(message)
        except:
            client_socket.close()
            break


# start a thread to receive messages from the server
receive_thread = threading.Thread(target=receive_messages)
receive_thread.start()

# continuously prompt the user to enter messages and send them to the server
while True:
    message = input()
    client_socket.send(message.encode("utf-8"))

client_socket.close()
print("You have left the chat")