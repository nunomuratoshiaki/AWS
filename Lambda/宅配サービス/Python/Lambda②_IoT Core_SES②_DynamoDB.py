import boto3
import AWSIoTMQTTClient
import logging
import time
import argparse
import json
import uuid
import random

from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
  try:
    dynamoDB = boto3.resource("dynamodb")
    table = dynamoDB.Table("table-name") # DynamoDBのテーブル名

    # DynamoDBへのquery処理実行
    queryData = table.query(
      KeyConditionExpression = Key("your-partition-key").eq("your-partition-key-data") & Key("your-sort-key").eq("your-sort-key-data"), # 取得するKey情報
      ScanIndexForward = False, # 昇順か降順か(デフォルトはTrue=昇順)
      Limit = 1 # 取得するデータ件数
    )
    return queryData
  except Exception as e:
        print e

from AWSIoTPythonSDK.MQTTLib 

AllowedActions = ['both', 'publish', 'subscribe']

def customCallback(client, userdata, message):
    print("Received a new message: ")
    print(message.payload)
    print("from topic: ")
    print(message.topic)
    print("--------------\n\n")


host = "xxxxxxxxxxxxxxxxxxx.amazonaws.com"  # エンドポイント
rootCAPath = "/xxxxx/work/cert/rootCA.pem"  # ルート証明書
certificatePath = "/xxxxx/work/cert/xxxxxxxxxx-certificate.pem.crt"  # モノの証明書
privateKeyPath = "/xxxxx/work/cert/xxxxxxxxxx-private.pem.key"  # プライベートキー
port = 8883
useWebsocket = False
clientId = "thing01"  # モノの名前
topic = "sdk/test/Python"  # データを送信・受信するトピック

mode = "both"  # 送信・受信両方の通信をする
message_text = "Hello AWS!"  # このプログラムで送信するテキスト

logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

myAWSIoTMQTTClient = None
if useWebsocket:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId, useWebsocket=True)
    myAWSIoTMQTTClient.configureEndpoint(host, port)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath)
else:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
    myAWSIoTMQTTClient.configureEndpoint(host, port)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

myAWSIoTMQTTClient.connect()
if mode == 'both' or mode == 'subscribe':
    myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
time.sleep(2)

loopCount = 0
while True:
    if mode == 'both' or mode == 'publish':
        u4 = str(uuid.uuid4())
        message = {}
        message['id'] = u4
        message['payload'] = message_text
        message['option_code'] = random.randrange(1, 10)
        messageJson = json.dumps(message)
        myAWSIoTMQTTClient.publish(topic, messageJson, 1)
        if mode == 'publish':
            print('%s Published topic %s: %s\n' % (loopCount, topic, messageJson))
        loopCount += 1
    time.sleep(1)
    
client=boto3.client('ses')

response=client.send_email(
    Source='string',  #電子メールを送信する電子メールアドレス
    Destination={
        'ToAddresses':[  #メッセージの宛先業に配置する受信者
            'string',
        ],
        'CcAddresses':[  #メッセージのCC:行に配置する受信者
            'string',
        ],
        'BccAddresses':[ #メッセージのBCC:行に配置する受信者
            'string',
        ]
    },
    Message={
        'Subject':{  #メッセージの件名
            'Data':'string',  #コンテンツのテキストデータ
            'Charset':'string' #コンテンツの文字セット
        },
        'Body':{ 
            'Text':{  #メッセージの内容をテキスト形式で指定
                'Data':'string', #コンテンツのテキストデータ
                'Charset':'string' #コンテンツの文字セット
            },
            'html':{ #メッセージの内容(HTML形式)
                'Data':'string', #コンテナのテキストデータ
                'Charset':'string' #コンテンツの文字セット
            }
        }
    },
    ReplyToAddresses=[
        'string',  #メッセージの送信先電子メールアドレス
    ],
    ReturnPath='string', #フィールドバック転送が有効な場合に、バウンド及び苦情が転送される電子メールアドレス
    SourceArn='string', #送信許可にのみ使用される。送信元パラメーターで指定された電子メールアドレスの送信を許可する、送信承認ポリシーに関連付けられているIDのARN
    ReturnPathArn='string', #送信許可にのみ使用されるSendPathパラメーターで指定された電子メールアドレスの使用を許可する、送信承認ポリシーに関連付けられているIDのARN 
    Tags=[
        {
            'Name':'string', #タグの名前
            'Value':'String' #タグの値
        },
    ],
    ConfigurationSetName='string' #SendEmailを使用して電子メールを送信するときに使用する構成セットの名前
)