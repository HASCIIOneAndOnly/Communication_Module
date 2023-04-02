import psycopg2
from psycopg2 import Error
import hashlib
import secrets


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


def hash_password(password, salt):
    hash_object = hashlib.sha256()
    hash_object.update((password + salt).encode('utf-8'))
    hashed_password = hash_object.hexdigest()
    return hashed_password


def generate_salt():
    return secrets.token_hex(16)


def authenticate(email_or_phone, password, connection):
    cursor = connection.cursor()
    cursor.execute(
        f"SELECT * FROM users WHERE email = '{email_or_phone}' OR phone = '{email_or_phone}'")

    user = cursor.fetchone()
    if user:
        hashed_password, salt = user[2], user[3]
        if (hash_password(password, salt) == hashed_password):
            return True
        else:
            print("\n" + 'Invalid password' + "\n")
            return False
    else:
        print('User with this email or password doesn\'t exists')
        return False


def register(email, phone, password, connection):
    cursor = connection.cursor()

    cursor.execute(
        f"SELECT * FROM users WHERE email='{email}' OR phone='{phone}'")
    user = cursor.fetchone()
    if user:
        print("\n" + 'User with this email or phone already exist' + "\n")
    else:
        salt = generate_salt()
        hashed_password = hash_password(password, salt)
        cursor.execute(
            f"INSERT INTO users VALUES('{email}', '{phone}', '{hashed_password}', '{salt}');")
        connection.commit()
        print("\n" + 'Succsess' + "\n")

