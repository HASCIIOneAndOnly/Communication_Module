import socket
import threading

print_lock = threading.Lock()


def receive_message(sock):
    while True:
        message = sock.recv(1024)
        if message:
            message = message.decode()
            with print_lock:
                print(f'{server_name}: {message}')


def send_message(sock, name):
    while True:
        message = input()
        with print_lock:
            sock.send(message.encode())


socket_server = socket.socket()


name = input('Введите имя: ')
socket_server.connect(('127.0.0.1', 5058))
socket_server.send(name.encode())
server_name = socket_server.recv(1024).decode()
print(f'{server_name} присоединился!')

# Start the receiving thread
receive_thread = threading.Thread(
    target=receive_message, args=(socket_server,))
receive_thread.start()

# Start the sending thread
send_thread = threading.Thread(target=send_message, args=(socket_server, name))
send_thread.start()

send_thread.join()
receive_thread.join()
