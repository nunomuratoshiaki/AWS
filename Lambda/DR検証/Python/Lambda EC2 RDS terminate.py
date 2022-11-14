import boto3 #インストールしたライブラリを使えるようにインポートする
import json  #インストールしたライブラリを使えるようにインポートする
region ='ap-northeast-1'  #リージョンを記入
client=boto3.client('ec2')  #AWSリソースを操作する準備(クライアントの作成)
client2=boto3.client('rds') #AWSリソースを操作する準備(クライアントの作成)
client3=boto3.client('autoscaling') #AWSリソースを操作する準備(クライアントの作成)

def lambda_handler(event, context):  #Lambdaの実行処理
    response=client.terminate_instances(
        InstanceIds=[  #EC2 インスタンスID
            'string',
        ],
        DryRun=False #実際に要求を問わずに、アクションに必要なアクセス許可があるかの確認(True|False)
    )
    response=client2.delete_db_instance(
        DBInstanceIdentifier='string', #削除するDBインスタンスのDB識別子
        SkipFinalSnapshot=True, #DBインスタンス削除される前に、最終的なDBスナップショットの作成をスキップするかどうかを示す値(True|False)
        FinalDBSnapshotIDentifier='string', #パラメータが無効になっているときに作成された新しいDBスナップショットのDBSnapshot識別子(制約 1~255文字または数字を指定 最初の文字は文字でなくてはならない ハイフンで終わる、又は2つの連続したハイフンを含めることはできない リードレプリカを削除するときに指定することはできない)
        DeleteAutomatedBackups=True #DBインスタンスが削除された直後に自動バックアップを削除するかどうかを示す値(True|False)
    )
    response=client3.delete_auto_scaling_group(
        AutoScalingGroupName='string', #自動スケーリンググループ名
        ForceDelete=True #グループがグループに関連付けられているすべてのインスタンスとともに削除されることを指定する。(True|False)
    )