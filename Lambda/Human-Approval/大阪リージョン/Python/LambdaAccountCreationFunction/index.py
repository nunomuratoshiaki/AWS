import json, os, boto3, time

org_root_id = os.environ['org_root_id']
org_unit_id = os.environ['org_unit_id']
customer_manual_url = os.environ['customer_manual_url']
approver_mail_address = os.environ['approver_mail_address']
support_mail_address = os.environ['support_mail_address']
spreadsheet_url = os.environ['spreadsheet_url']

# 2022.8.26 add
client   = boto3.client('stepfunctions')

def handler(event, context):
    print('event= ' + json.dumps(event))

    # アカウント作成
    form_data = event['ExecutionContext']['Execution']['Input']['namedValues']
    account_name = form_data['企業ドメイン名'][0] + "_" + form_data['契約番号'][0]+"E"  #"E" means ECAM
    print("account_name:"+account_name)
    account_email = form_data['お客様のAWSアカウントに登録するメールアドレス'][0]
    print("account_email:"+account_email)
    organization = boto3.client('organizations')
    new_account_status = ''
    try:
        print("Start to create account...")
        print("exec organization.create_account...")
        account = organization.create_account(
            AccountName=account_name,
            Email=account_email,
            IamUserAccessToBilling='DENY',
            Tags=[
                {
                    'Key': 'keiyaku_id',
                    'Value': form_data['契約番号'][0]
                },
                {
                    'Key': 'customername',
                    'Value': form_data['企業ドメイン名'][0]
                }
            ]
        )
        print("response of organization.create_account = ", account)
        account_status_id = account['CreateAccountStatus']['Id']
        while True:
            print("waiting for finishing account creation...")
            time.sleep(1)
            new_account_status = organization.describe_create_account_status(
                CreateAccountRequestId=account_status_id)
            print("organization.describe_create_account_status = ", new_account_status)    
            creation_status=new_account_status['CreateAccountStatus']['State']
            if creation_status == 'SUCCEEDED':
                print("CreateAccountStatus.state=SUCCEEDED.")
                account_id = new_account_status['CreateAccountStatus']['AccountId']
                organization.move_account(AccountId=account_id, SourceParentId=org_root_id, DestinationParentId=org_unit_id)
                # StepFunctionを再開させる
                ret = {
                    'Status': creation_status,
                    'StatusMsg': '',
                    'account_id': ''
                }
                result = client.send_task_success(
                    taskToken = event['executionContext']['Task']['Token'],
                    output    = json.dumps((ret))
                )
                print('stepfunctions.send_task_success is done. The status is - ' + json.dumps(result))
                return ret
                break
            elif creation_status == 'FAILED':
                print("CreateAccountStatus.state=FAILED.")
                # StepFunctionをFAILさせる
                ret = {
                    'Status': creation_status,
                    'StatusMsg': new_account_status['CreateAccountStatus']['FailureReason'],
                    'account_id': ''
                }                
                result = client.send_task_failure(
                    taskToken=event['ExecutionContext']['Task']['Token'],
                    error=creation_status,
                    cause=new_account_status['CreateAccountStatus']['FailureReason']
                )
                print('stepfunctions.send_task_failure is done. The status is - ' + json.dumps(result))
                return ret
                break
                # memo. generally, FailureReason is 'EMAIL_ALREADY_EXISTS'
    except Exception as e:
        print('=== error details ===')
        print('e:' + str(e))
        print("Error;", new_account_status)
        raise e
