import boto3 #インストールしたライブラリを使えるようにインポートする
import json  #インストールしたライブラリを使えるようにインポートする
reagion='ap-northeast-3'  #リージョンを記入
client=boto3.client('autoscaling')  #AWSリソースを操作する準備(クライアントの作成)

def lambda_handler(event,context):  #Lambdaの実行処理
    response=client.set_desired_capacity(
        AutoScalingGroupName='string',  #オートスケーリング グループ名
        DesiredCapacity=2, #希望する容量(数字)
        HonorCooldown=True, #オートスケーリングがクールダウン期間が完了するまで待機するか(True|False)
)