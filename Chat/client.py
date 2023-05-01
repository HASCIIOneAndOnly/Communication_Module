import socket

socket_server = socket.socket()

name = input('Введите имя: ')
socket_server.connect(('127.0.0.1', 5059))
socket_server.send(name.encode())
server_name = socket_server.recv(1024).decode()
print(f'{server_name} присоединился!')

while True:
    message = (socket_server.recv(1024)).decode()
    print(f'{server_name}: {message}')
    message = input(f'{name}: ')
    socket_server.send(message.encode())
