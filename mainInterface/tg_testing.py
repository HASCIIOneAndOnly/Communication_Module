# import requests
# TOKEN = '5717083963:AAHflxPNEMzSklg_hc5Snbs24MQv4aaUyNU'
# url = f'https://api.telegram.org/bot{TOKEN}/getUpdates'
# print(requests.get(url).json())

import requests
TOKEN = '5717083963:AAHflxPNEMzSklg_hc5Snbs24MQv4aaUyNU'
chat_id = '418807851'
message = "Здарова\nЧто делаешь?"
url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
print(requests.get(url).json()) # Эта строка отсылает сообщение