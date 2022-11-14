console.log('Loading function');
const AWS = require('aws-sdk');

function sendmail(MAILSBJ,DestAddr,htmlMAILBODY,plainMAILBODY) {
  // Create sendEmail params
  var params = '';
  params = {
    Destination: DestAddr,
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: htmlMAILBODY
        },
        Text: {
         Charset: "UTF-8",
         Data: plainMAILBODY
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: process.env.mailsubject_prefix + MAILSBJ
       }
      },
    Source: process.env.support_mail_address /* required */
    //ReplyToAddresses: [process.env.support_mail_address]
  };
/*
  // Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
      //return null; // add 2022.07.22
      // changed 2022.08.21
      const dateTime1 = new Date(); // UTCの日時と仮定しています
      dateTime1.setTime(dateTime1.getTime() + 1000 * 60 * 60 * 9);
      return {"mail_date": dateTime1.toISOString().slice(0, 10) };
    }).catch(
      function(err) {
      console.error(err, err.stack);
      return err; // add 2022.07.22
    });
*/
  const ses = new AWS.SES();
  ses.sendEmail(params, (err, res) => {
  if (err) {
    console.log("sendmail was failed ; " + err);
    context.fail(new Error("Error!"));
  }
  console.log("sendmail was succeeded ; " + res);
});

}

exports.lambda_handler = (event, context, callback) => {
  console.log('event= ' + JSON.stringify(event));
  console.log('context= ' + JSON.stringify(context));
  
  // executionContextはStepFunctionsにて独自定義したJSONPATH名
  const executionContext = event.ExecutionContext;
  // change 2022.07.22
  //console.log('executionContext= ' + executionContext);
  console.log('executionContext= ' + JSON.stringify(executionContext));
  
  const executionName = executionContext.Execution.Name;
  console.log('executionName= ' + executionName);
  
  const statemachineName = executionContext.StateMachine.Name;
  console.log('statemachineName= ' + statemachineName);
  
  // add 2022.07.27
  const caller = executionContext.State.Name;
  console.log('caller= ' + caller);
  
  //
  var taskToken, apigwEndpint;
  // Lambdaの応答待ち設定がされていた場合はTaskTokenを指定
  if (executionContext.Task) {
    taskToken = executionContext.Task.Token;
  }
  // API Gatewayから呼ばれない場合に処理分岐が必要
  if (event.APIGatewayEndpoint) {
    apigwEndpint = event.APIGatewayEndpoint + "/execution?ts=" + Date.now() + "&ex=" + executionName + "&sm=" + statemachineName + "&taskToken=" + encodeURIComponent(taskToken);
  }
  
  console.log('taskToken= ' + taskToken);
  console.log('apigwEndpint = ' + apigwEndpint);
  
  const emailSnsTopic = "arn:aws:sns:ap-northeast-1:772008686221:AccountCreation2-SNSHumanApprovalEmailTopic-19EOJ1PPRQHKJ";
  console.log('emailSnsTopic= ' + emailSnsTopic);

  const approver_mail_address = process.env.approver_mail_address;
  const support_mail_address = process.env.support_mail_address;

  const mailmsg = require('./mailmsg.js');
  const InputValue = executionContext.Execution.Input.namedValues;
  
  // Set the region 
  AWS.config.update({region: 'ap-northeast-1'});
  
  let DestAddr = {}, htmlMAILBODY = '', plainMAILBODY = '';
  if (caller == 'Lambda Callback') {
    // 1st mail
    console.log('sending apprication registered notification to KKA approver...');
    DestAddr = {"ToAddresses": [ approver_mail_address ], "CcAddresses":[ support_mail_address ]};
    htmlMAILBODY = mailmsg.approvalrequest(InputValue,apigwEndpint+"&action=approve",apigwEndpint+"&action=reject"); 
    sendmail('AWSアカウント新規作成の承認依頼', DestAddr,htmlMAILBODY,htmlMAILBODY);
    // 2nd mail
    console.log('sending apprication registered notification to KKA sales...');
    DestAddr = {"ToAddresses": [InputValue['営業担当メールアドレス'][0],InputValue['アシスタントメールアドレス'][0]]};
    htmlMAILBODY = mailmsg.appplynotification(InputValue); 
    sendmail('AWSアカウント新規作成申請を受領しました',DestAddr,htmlMAILBODY,htmlMAILBODY);
    
  } else if (caller == 'ValidationRequest') {
    console.log('sending validation request to CUS...');
    DestAddr = {"ToAddresses": [InputValue['お客様のAWSアカウントに登録するメールアドレス'][0]], "CcAddresses":[ support_mail_address ]};
    htmlMAILBODY = mailmsg.ValidateMailAddrHTML(InputValue, apigwEndpint+"&action=validate"); 
    plainMAILBODY = mailmsg.ValidateMailAddrPLAIN(InputValue, apigwEndpint+"&action=validate"); 
    if (executionContext.State.RetryCount == 0 ) {

      sendmail('【アシスト】AWSアカウント登録用メールアドレスの有効性確認',DestAddr,htmlMAILBODY,plainMAILBODY);
    } else {
      sendmail('【再送】【アシスト】AWSアカウント登録用メールアドレスの有効性確認',DestAddr,'<p>＊＊＊お手続き未完了のお客様へ再送メールです＊＊＊</p>'+htmlMAILBODY,'＊＊＊お手続き未完了のお客様へ再送メールです＊＊＊>'+plainMAILBODY,);
    }
    
  } else if (caller == 'CreateAccountFailureNotice') {
    console.log('sending error notification for accountcreation to aws_ship...');
    DestAddr = {"ToAddresses": [ support_mail_address ]};
    htmlMAILBODY = mailmsg.AccountCrationFailed(InputValue, event.LambdaOutput.TaskFailedDetail.Cause); 
    sendmail('AWSアカウント登録処理が失敗しました',DestAddr,htmlMAILBODY,htmlMAILBODY);
    
  } else if (caller == 'EmailChangeRequest') {
    console.log('sending request of change the e-mail to CUS...');
    DestAddr = {"ToAddresses": [InputValue['お客様のAWSアカウントに登録するメールアドレス'][0]], "CcAddresses":[ support_mail_address ]};
    htmlMAILBODY = mailmsg.EmailChangeRequest(InputValue); 
    sendmail('【アシスト】AWSアカウント登録用メールアドレスの変更依頼',DestAddr,htmlMAILBODY,htmlMAILBODY);
    
  } else if (caller == 'CreateAccountSuccessNotice') {
      console.log(JSON.stringify(event.LambdaOutput));
      console.log('sending thanks-mail to CUS...');
      DestAddr = {"ToAddresses": [InputValue['お客様のAWSアカウントに登録するメールアドレス'][0]], "CcAddresses":[ support_mail_address ]};
      htmlMAILBODY = mailmsg.AccountCrationSucceeded(InputValue); 
      sendmail('【アシスト】AWS利用開始のお知らせ',DestAddr,htmlMAILBODY,htmlMAILBODY);   
      
  } else {
    const errmsg = 'sendmail did not excecuted due to unrecognized caller;' + caller;
    console.log(errmsg);
    context.fail(new Error("Error!"));
  }
  console.log('sendmail was succeeded.');
};