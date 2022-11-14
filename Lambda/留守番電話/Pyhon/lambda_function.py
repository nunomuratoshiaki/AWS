import boto3

def lambda_handler(event, context):
    client = boto3.client('sns')

    TOPIC_ARN = 'arn:aws:sns:ap-northeast-1:444191796992:test-nunomura'     
    msg = 'http://n-toshiaki-connect.s3-website-ap-northeast-1.amazonaws.com'
    subject = 'S3からの留守番電話'

    response = client.publish(
        TopicArn = TOPIC_ARN,
        Message = msg,
        Subject = subject
    )

    return response
