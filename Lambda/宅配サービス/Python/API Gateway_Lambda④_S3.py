import json
import boto3
import base64
import io
from datetime import datetime
import cgi

BUCKET_NAME='xxxx-test-backet-1'
DIRECTORY='uploaded_files/'

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    bucket = s3.Bucket(BUCKET_NAME)
    
    body = base64.b64decode(event['body-json'])
    fp = io.BytesIO(body)
    
    environ = {'REQUEST_METHOD': 'POST'}
    headers = {
        'content-type': event['params']['header']['content-type'], 
        'content-length': len(body)
    }

    fs = cgi.FieldStorage(fp=fp, environ=environ, headers=headers)
    for f in fs.list:
        print("filename=" + f.filename)
        bucket.put_object(Body=f.value, Key=DIRECTORY+f.filename)

    return {
        'statusCode': 200,
        'body': json.dumps('アップロード完了')
    }