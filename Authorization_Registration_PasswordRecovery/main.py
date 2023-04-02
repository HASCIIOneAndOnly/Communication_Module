from test import *

connection = create_connection(
    'course_project_db', 'amepifanov', 'fhntv2003',  'localhost', '5050'
)

cursor = connection.cursor()
cursor.execute('''DROP TABLE users''')
cursor.execute('''CREATE TABLE users(
    email VARCHAR(30) NOT NULL,
    phone BIGINT NOT NULL,
    password VARCHAR(30) NOT NULL
); ''')
cursor.execute(
    '''INSERT INTO users VALUES('epifanov03@mail.ru', 89261091717, 'fhntv2003');
    INSERT INTO users VALUES('dizzydw@yandex.ru', '89268955219', 'fhntv2003');''')
connection.commit()

cursor.execute('SELECT * FROM public.users')
record = cursor.fetchall()
cursor.close()
connection.close()
print(record)


#print(authenticate(89261091717, 'fhntv2003'))
print(authenticate('epifanov03@mail.ru', 'fhntv2003'))