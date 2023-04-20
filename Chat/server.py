import socket
import threading

print_lock = threading.Lock()


def receive_message(conn):
    while True:
        message = conn.recv(1024)
        if message:
            message = message.decode()
            with print_lock:
                print(f'{client}: {message}')


def send_message(conn, name):
    while True:
        message = input()
        with print_lock:
            conn.send(message.encode())


new_socket = socket.socket()
new_socket.bind(('127.0.0.1', 5058))
new_socket.listen()

print('Запустили сервер')
name = input('Введите имя: ')
connection, add = new_socket.accept()

client = (connection.recv(1024)).decode()
print(client + ' присоединился!')
connection.send(name.encode())

# Start the receiving thread
receive_thread = threading.Thread(target=receive_message, args=(connection,))
receive_thread.start()

# Start the sending thread
send_thread = threading.Thread(target=send_message, args=(connection, name))
send_thread.start()

send_thread.join()
receive_thread.join()

