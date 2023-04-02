import psycopg2
from psycopg2 import Error

def create_connection(db_name, db_user, db_password, db_host, db_port):
    connection = None
    try:
        connection = psycopg2.connect(
            database=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
        )
        print('Connection to PostgreSQL DB successful')
    except Error as e:
        print(f"Error: '{e}' ")
    return connection


def authenticate(email_or_phone, password):
    connection = create_connection(
        'course_project_db', 'amepifanov', 'fhntv2003',  'localhost', '5050'
    )
    cursor = connection.cursor()
    if (type(email_or_phone) is str):
        cursor.execute(
            f"SELECT * FROM users WHERE email = '{email_or_phone}' AND password = '{password}'")

    else:
        cursor.execute(
            f"SELECT * FROM users WHERE phone = {email_or_phone} AND password = '{password}'")

    user = cursor.fetchone()
    print(user)
    cursor.close()
    connection.close()
    if user:
        return True
    else:
        return False


