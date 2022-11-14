from __future__ import print_function
import boto3
import json

def lambda_handler(event, context):
    for record in event['Records']:

        payload = record["body"]
        print(str(payload))
        
    dynamoDB = boto3.resource("dynamodb")
    table = dynamoDB.Table("inspection-dynamodb")# DynamoDBのテーブル名
	# DynamoDBへのPut処理実行
    table.put_item(
      Item = {
        "key":str(payload),   # Partition Keyのデータ
        "value":str(payload),  # Sort Keyのデータ
	"OtherKey": str(payload)  # その他のデータ
      }
    )