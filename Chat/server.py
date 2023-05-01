import socket

new_socket = socket.socket()
new_socket.bind(('127.0.0.1', 5059))
new_socket.listen()

print('Запустили сервер')
name = input('Введите имя: ')
connection, add = new_socket.accept()

client = (connection.recv(1024)).decode()
print(client + ' присоединился!')
connection.send(name.encode())

while True:
    message = input(f'{name}: ')
    connection.send(message.encode())
    message = connection.recv(1024)
    message = message.decode()
    print(f'{client}: {message}')
