from functions import create_connection
from functions import authenticate
from functions import register

connection = create_connection(
    'course_project_db', 'amepifanov', 'fhntv2003',  'localhost', '5050'
)

cursor = connection.cursor()
cursor.execute('''DROP TABLE users''')
cursor.execute('''CREATE TABLE users(
    email VARCHAR(30) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    hashed_password VARCHAR(64) NOT NULL,
    salt VARCHAR(32) NOT NULL
); ''')

register('epifanov03@mail.ru', '89261091717', '1234', connection)

register('dizzydw@yandex.ru', '89268955219', '1234', connection)

register('abcd@mail.ru', '89261091717', '1234', connection)

register('dizzydw@yandex.ru', '89268955211', '1234', connection)

register('abcd@mail.ru', '89268955211', '1234', connection)

cursor.execute('SELECT * FROM public.users')
record = cursor.fetchall()
print("\n" + str(record) + "\n")


print(authenticate('epifanov03@mail.ru', 'hui', connection))
print('\n\n')
print(authenticate('epifanov03@mail.ru', '1234', connection))
cursor.close()
connection.close()