import json
import requests
import urllib
import time

from urllib.parse import urlparse

from Telegram.dbhelper import DBHelper


db = DBHelper()

TOKEN = "6039921783:AAF1cemhYX_oUXSfSPAPh9NRv8H7oK73-FM"
# TOKEN = "empty"
URL = "https://api.telegram.org/bot{}/".format(TOKEN)

welcoming_message = "Добрый день ! \n" \
                    "Вы обратились в компанию Орензнак\n" \
                    "Мы рады приветствовать Вас\n" \
                    "Пожалуйста выберите\n"


def tg_setup():

    db.setup()
    last_update_id = None
    while True:
        updates = get_updates(last_update_id)
        if len(updates["result"]) > 0:
            last_update_id = get_last_update_id(updates) + 1
            handle_updates(updates)
        time.sleep(1)


def get_url(url):
    response = requests.get(url)
    content = response.content.decode("utf8")
    return content


def get_json_from_url(url):
    content = get_url(url)
    js = json.loads(content)
    return js


def get_updates(offset=None):
    url = URL + "getUpdates?timeout=100"
    if offset:
        url += "&offset={}".format(offset)
    js = get_json_from_url(url)
    return js


def get_last_update_id(updates):
    update_ids = []
    for update in updates["result"]:
        update_ids.append(int(update["update_id"]))
    return max(update_ids)


def handle_updates(updates):
    for update in updates["result"]:
        text = update["message"]["text"]
        chat = update["message"]["chat"]["id"]
        items = db.get_items(chat)  ##
        if text == "/done":
            keyboard = build_keyboard(items)
            send_message("Select an item to delete", chat, keyboard)
        elif text == "/start":
            send_message(
                welcoming_message,
                chat)
            items_in_keyboard = ["Оформить Заказ", "Информация о заказе", "Связаться с менеджером"]
            keyboard = build_keyboard(items_in_keyboard)
            send_message("Выберите наиболее подходящую причину обращения:", chat, keyboard)
        elif text.startswith("/"):
            continue
        elif text in items:
            db.delete_item(text, chat)  ##
            items = db.get_items(chat)  ##
            keyboard = build_keyboard(items)
            send_message("Select an item to delete", chat, keyboard)
        else:
            db.add_item(text, chat)  ##
            items = db.get_items(chat)  ##
            message = "\n".join(items)
            send_message(message, chat)


def get_last_chat_id_and_text(updates):
    num_updates = len(updates["result"])
    last_update = num_updates - 1
    text1 = updates["result"][last_update]["message"]["text"]
    chat_id = updates["result"][last_update]["message"]["chat"]["id"]
    return text1, chat_id


def send_message(text, chat_id, reply_markup=None):
    text = urllib.parse.quote_plus(text)
    print(chat_id)
    url = URL + "sendMessage?text={}&chat_id={}&parse_mode=Markdown".format(text, chat_id)
    if reply_markup:
        url += "&reply_markup={}".format(reply_markup)
    get_url(url)


def build_keyboard(items):
    keyboard = [[item] for item in items]
    reply_markup = {"keyboard": keyboard, "one_time_keyboard": True}
    return json.dumps(reply_markup)
