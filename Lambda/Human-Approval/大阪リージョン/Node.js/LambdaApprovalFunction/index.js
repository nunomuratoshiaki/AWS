const AWS = require('aws-sdk');
var redirectToStepFunctions = function(lambdaArn, statemachineName, executionName, callback) {
  const lambdaArnTokens = lambdaArn.split(":");
  const partition = lambdaArnTokens[1];
  const region = lambdaArnTokens[3];
  const accountId = lambdaArnTokens[4];

  console.log("partition=" + partition);
  console.log("region=" + region);
  console.log("accountId=" + accountId);

  const executionArn = "arn:" + partition + ":states:" + region + ":" + accountId + ":execution:" + statemachineName + ":" + executionName;
  console.log("executionArn=" + executionArn);

  const url = "https://console.aws.amazon.com/states/home?region=" + region + "#/executions/details/" + executionArn;
  callback(null, {
      statusCode: 302,
      headers: {
        Location: url
      }
  });
};

exports.handler = (event, context, callback) => {
  console.log('Event= ' + JSON.stringify(event));
  const action = event.query.action;
  const taskToken = event.query.taskToken;
  const statemachineName = event.query.sm;
  const executionName = event.query.ex;

  const stepfunctions = new AWS.StepFunctions();

  var message = "";
  
  //add auth..
  let thresholdtime = '', waitmins = '';
  console.log('DEBUG_MODE=' + process.env.DEBUG_MODE.toLowerCase());
  if (process.env.DEBUG_MODE.toLowerCase() == 'true') {
    thresholdtime = Number(event.query.ts) + 10000;
    waitmins = '10sec';
  } else {
    thresholdtime = Number(event.query.ts) + 900000;
    waitmins = '15分';
  }
  console.log('checking non-human access...');
  console.log('ts=' + event.query.ts + ', Now is ' + Date.now() + ', thresholdtime=' + thresholdtime + ', countdown=' + (Date.now() - thresholdtime) );  
  
  if (thresholdtime > Date.now()) {
    console.log("Exit this Lambda due to too early access. Then, the relevant StepFunctions won't work.");
    // Comment
    // https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/handle-errors-in-lambda-integration.html
    // Lambda カスタム統合の場合、統合レスポンスで Lambda によって返されたエラーを、クライアントの標準 HTTP エラーレスポンスにマップする必要があります。
    // そうしないと、Lambda のエラーはデフォルトで 200 OK レスポンスとして返されるため、API ユーザーは直感的に理解できません。    
    let response = {
        statusCode: '403',
        body: JSON.stringify({ error: 'このリクエストはBotアクセスの可能性があると判断され、受付けられませんでした。' + waitmins + '後に再度アクセスしてください。' }),
        headers: {
            'Content-Type': 'application/json',
        }
    };
    callback(null, response);
    
  } else {
    var dispmsg = '';
    var dateTimeJst = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    dateTimeJst = dateTimeJst.getFullYear() + "-" + (dateTimeJst.getMonth() + 1) + "-" + dateTimeJst.getDate();
    
    if (action === "approve") {
      message = { 
        "StatusMsg": "Approved! Task approved by awssp_ship@ashisuto.co.jp",
        "DateTimeJst": dateTimeJst
      };
      dispmsg = "承認処理は正常に受付けられました。";
    } else if (action === "reject") {
      message = { 
        "StatusMsg": "Rejected! Task rejected by awssp_ship@ashisuto.co.jp",
        "DateTimeJst": dateTimeJst
      };
      dispmsg = "キャンセル処理は正常に受付けられました。KKA社員にて申請データを修正しStepFunctionを手動実行するか、営業に再申請を依頼してください。";
    } else if (action === "validate") {
      message = {
        "StatusMsg": "Validated! Task validated by awssp_ship@ashisuto.co.jp",
        "DateTimeJst": dateTimeJst
      };
      dispmsg = "メールアドレスが有効であることを確認しました。アカウント作成処理は自動開始され、作成結果をメールでご連絡差し上げます。";
    } else {
      console.error("Unrecognized action. Expected: approve, reject or valida.");
      callback({"StatusMsg": "Failed to process the request. Unrecognized Action."});
    }
  
    stepfunctions.sendTaskSuccess({
      output: JSON.stringify(message),
      taskToken: event.query.taskToken
    })
    .promise()
    .then(function(data) {
      //redirectToStepFunctions(context.invokedFunctionArn, statemachineName, executionName, callback);
      // change the logic
      let response = {
          statusCode: '200',
          body: JSON.stringify({ success: dispmsg }),
          headers: {
              'Content-Type': 'application/json',
          }
      };
      console.log('stepfunctions.sendTaskSuccess was succeeded')
      callback(null, response);

    }).catch(function(err) {
      console.error(err, err.stack);
      //callback(err);
      // change the logic
      var errreason ='';
      if (err.message.match('Task Timed Out') != null ) {
        errreason = 'アクセスいただいたリンクは有効期間を過ぎ無効となっため、処理は受け付けられませんでした。新しいメールが届いている可能性があるためご確認ください。新しいメールが届いてない場合は aws@ashisuto.co.jp までご連絡をお願いします。';
      } else {
        errreason = '処理は受け付けられませんでした。err='+err.message;
      }
      
      let response = {
          statusCode: '200',
          body: JSON.stringify({ failed: errreason }),
          headers: {
              'Content-Type': 'application/json',
          }
      };
      callback(null, response);
    });
    
  }
}
