import boto3

def lambda_handler(event, context):
    result = event['detail']['result']
    snapshotId = ",".join(event['resources'])
    startTime = event['detail']['startTime']
    endTime = event['detail']['endTime']

    client = boto3.client('sns')

    sns_response = client.publish(
        TopicArn="arn:aws:sns:ap-northeast-1:097812774743:snapshot-topic",
        Message=('SNS のスナップショットが作成されました。\n詳細は以下です。\n\n結果：'
        + result
        + '\nスナップショットID：'
        + snapshotId
        + '\n作成開始時間：'
        + startTime
        + '\n作成終了時間：'
        + endTime
        + '\n\n'),
        Subject='demo-SnapshotCreateTime'
    )

    return sns_response
