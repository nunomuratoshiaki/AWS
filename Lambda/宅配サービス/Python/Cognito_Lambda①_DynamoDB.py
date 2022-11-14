import boto3

def lambda_handler(event, context):

    dynamoDB = boto3.resource("dynamodb")
    # DynamoDBのテーブル名
    table = dynamoDB.Table("delivery-test")

    # DynamoDBへデータを追加する
    table.put_item(
      Item = {
        "email":event['request']['userAttributes']['email'],
        "name":event['request']['userAttributes']['name']
      }
    )

    return eventimport boto3
