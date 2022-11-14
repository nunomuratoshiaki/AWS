# AWSをPythonで利用するためのSDK boto3をインポートする
import boto3

from boto3.dynamodb.conditions import Key, Attr
 
# Functionの実行ログを出力
print('Loading function')
 
# DynamoDBと接続
dynamodb = boto3.resource('dynamodb')
 
# テーブル内のIDを指定してデータを該当するitemを取得する
def lambda_handler(event, context):
    table_name = "testdb"
    partition_key = {"id": event["id"]}
    dynamotable = dynamodb.Table(table_name)
    res = dynamotable.get_item(Key=partition_key)
    item = res["Item"]
    
    return item


#API用の設定
{
    "id" : "$input.params('id')"
}



#テスト用の設定
{
  "id": "1001"
}
