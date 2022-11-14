"use strict";

const support_mail_address = process.env.support_mail_address;
const spreadsheet_url = process.env.spreadsheet_url;

// 複数の関数.
exports.approvalrequest = (InputValue,approve_url,reject_url) => {
    var KKA_Sup_Apply ='無し';
    if ( InputValue["アシストAWSサポート利用申込書"][0] != '' ) {
        KKA_Sup_Apply = InputValue["アシストAWSサポート利用申込書"][0];
    }
    var txtbody = `
<html>
        <head></head><body>

        AWS業務担当者
        <br><br>
        ${InputValue["アシスタント担当者名"][0]}さんより、${InputValue["お客様企業名, 団体名"][0]}様のAWSの利用申込書が連携されました。<br>
        以下の情報で登録して良いか、ご確認ください。<br>
        <br><br>
        ・アカウント名：${InputValue["企業ドメイン名"][0]}_${InputValue["契約番号"][0]}E<br>
        ・登録するメールアドレス：${InputValue["お客様のAWSアカウントに登録するメールアドレス"][0]}<br>
        <br>
        キー：keiyaku_id<br>
        値：${InputValue["契約番号"][0]}<br>
        <br>
        キー：customername<br>
        値：${InputValue["企業ドメイン名"][0]}<br>
        <br>
        <a href="${spreadsheet_url}">スプレッドシート</a><br>        
        AWS利用申込書：<a href='${InputValue["AWS利用申込書"][0]}'>${InputValue["AWS利用申込書"][0]}</a><br>
        アシストAWSサポート利用申込書：<a href='${InputValue["アシストAWSサポート利用申込書"][0]}'>${KKA_Sup_Apply}</a><br><br>
        <a href='${approve_url}' style="background-color: #008CBA; color: white;padding: 12px 38px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;-webkit-transition-duration: 0.4s;transition-duration: 0.4s; ">承認</a>
        <br><br>
        <a href='${reject_url}' style="background-color: #f44336; color: white;padding: 12px 38px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;-webkit-transition-duration: 0.4s;transition-duration: 0.4s; ">キャンセル</a>
        <br><br>
        以上となります。<br>
        </body>
</html>
`;
    return txtbody;
};

exports.appplynotification = (InputValue) => {
    var txtbody = `
<html>
        <head></head><body>
        営業部ご担当者<br>
        <br>
        お疲れ様です。<br>
        AWSアカウント作成依頼を受領いたしました。<br>
        <br>
        新規アカウント情報は以下となります。<br>
        ・アカウント名：${InputValue["企業ドメイン名"][0]}_${InputValue["契約番号"][0]}E<br>
        ・登録するメールアドレス：${InputValue["お客様のAWSアカウントに登録するメールアドレス"][0]}<br>
        <br>
        また、ご登録いただいたフォームの内容は以下となります。<br>
        ・営業担当者名：${InputValue["営業担当者名"][0]}<br>
        ・営業担当メールアドレス：${InputValue["営業担当メールアドレス"][0]}<br>
        ・アシスタント担当者名：${InputValue["アシスタント担当者名"][0]}<br>
        ・アシスタントメールアドレス：${InputValue["アシスタントメールアドレス"][0]}<br>
        ・お客様のAWSアカウントに登録するメールアドレス：${InputValue["お客様のAWSアカウントに登録するメールアドレス"][0]}<br>
        ・お客様企業名, 団体名：${InputValue["お客様企業名, 団体名"][0]}<br>
        ・企業ドメイン名：${InputValue["企業ドメイン名"][0]}<br>
        ・契約番号：${InputValue["契約番号"][0]}<br>
        <br>
        <a href='${InputValue["AWS利用申込書"][0]}'>AWS利用申込書のリンク</a><br>
        <a href="${spreadsheet_url}">スプレッドシートのリンク</a>
        <br><br><br>
        今後の流れは以下のとおりです。<br>
        STEP1. GoogleフォームとAWS利用申込書の内容を確認 （実施者：AWS業務担当） <br>
        STEP2. お客様メールアドレスの有効性確認 （実施者：AWS業務担当とお客様） <br>
        STEP3. お客様アカウントの作成と「AWS利用開始のお知らせ」のメールを送信（実施者：AWS業務担当） <br>
        <br>
        ※「AWS利用開始のお知らせ」はTO:お客様、CC:担当営業・アシスタント宛に送られます。<br>
        　「AWS利用開始のお知らせ」メールを受信したらアカウント作成手続きは問題なく完了したとご判断ください。<br>
        ※STEP1からSTEP3までの所要日数は最短１営業日、最長1週間程度です。<br>
`;
    let ts = Date.now();
    let date_ob = new Date(ts);
    if (date_ob >= 21) {
        txtbody += `
        ※特に毎月21日以降にAWSアカウントの作成を依頼された場合は、ロイ処理の都合上、<br>
        STEP1の手続きを翌月初にさせていただきます。<br>
        営業都合上、至急アカウント作成手続きをご希望される場合は<br>
        本メールに返信する形でご連絡ください。<br>
`;
    }
    
        txtbody += `
        <br>
        以上<br>
        </body>
</html>
`;
    return txtbody;
};


exports.ValidateMailAddrHTML = (InputValue, validation_url) => {
    var txtbody = `
<html>
        <head></head><body>
        ${InputValue["お客様企業名, 団体名"][0]}<br>
        ご担当者様<br>
        <br>
        平素は大変お世話になっております。株式会社アシスト AWS運営事務局です。<br>
        <br>
        この度は、弊社よりAWSアカウントのご契約をいただきまして<br>
        誠にありがとうございます。<br>
        <br>
        AWSアカウント作成時のエラー防止のため、事前にメールアドレスの有効性を確認しております。<br>
        下記リンクへのアクセスをもってお客様が本メールを受信できていることを確認し、<br>
        その後AWSアカウント作成処理を開始します。<br><br>
        以下のリンクをクリックしていただきますようお願い申し上げます。<br>
        <a href="${validation_url}">AWSアカウント登録用メールアドレスの有効性確認</a><br>
        ※リンクをクリックできない場合、またはリンク先画面で<br>
        「メールアドレスが有効であることを確認しました」と表示されない場合は、<br>
        本メールを返送いただければ、メールアドレスが有効であると判断しAWSアカウント作成処理を進めさせていただきます。<br>
        <br><br>
        <br>
        株式会社アシスト<br>
        クラウド技術本部 AWS運営事務局<br>
        ${support_mail_address}<br>
        <br>
        </body>
</html>              
`;
    return txtbody;
};


exports.ValidateMailAddrPLAIN = (InputValue, validation_url) => {
    var txtbody = `
${InputValue["お客様企業名, 団体名"][0]}
ご担当者様

平素は大変お世話になっております。株式会社アシスト AWS運営事務局です。
この度は、弊社よりAWSアカウントのご契約をいただきまして誠にありがとうございます。
登録いただきましたメールアドレス宛に本メールお送りしています。

登録いただきましたメールアドレスが有効に存在していることを確認するため
下記URLにアクセスいただきますようお願いいたします。その後、AWSアカウント作成が自動的に開始されます。
${validation_url}

インターネットサイトを閲覧できない場合や、URLにアクセスした際に「メールアドレス確認処理は正常に受付けられました」と表示されない場合は、
本メールをそのまま返送いただければ、弊社にてメールアドレスが有効であると判断しAWSアカウント作成処理を進めさせていただきます。


以上、よろしくお願いします。

／／／／／／／／／／／／／／／／／
株式会社アシスト
クラウド技術本部 AWS運営事務局
${support_mail_address}
`;
    return txtbody;
};

exports.EmailChangeRequest = (InputValue) => {
    var txtbody = `
<html><head></head><body>
${InputValue["お客様企業名, 団体名"][0]}<br>
ご担当者様<br>
<br>
お客様にご指定いただきましたメールアドレス ${InputValue['お客様のAWSアカウントに登録するメールアドレス'][0]} は<br>
既にAWSに登録されておりました。<br>
つきましては、本メールの返信で新しいメールアドレスのご連絡をお願いいたします。<br>
<br>
<br>
以上、よろしくお願いします。<br>
<br>
／／／／／／／／／／／／／／／／／<br>
株式会社アシスト<br>
クラウド技術本部 AWS運営事務局<br>
${support_mail_address}<br>
</body></html>   
`;
    return txtbody;
};

exports.AccountCrationFailed = (InputValue,FailedReason) => {
    var txtbody = `
<html>
        <head></head><body>

        AWS業務担当者
        <br><br>
        ${InputValue["お客様企業名, 団体名"][0]}様のAWSアカウント登録が失敗しました。<br>
        <br><br>
        ・アカウント名：${InputValue["企業ドメイン名"][0]}_${InputValue["契約番号"][0]}E<br>
        ・登録メールアドレス：${InputValue["お客様のAWSアカウントに登録するメールアドレス"][0]}<br>
        ・エラー内容：${FailedReason}<br>
        <br>
        技術部社員にて対処してください。<br>
        </body>
</html>
`;
    return txtbody;
};


exports.AccountCrationSucceeded = (InputValue) => {
    const manual_url = process.env.customer_manual_url;
    var txtbody = `
<html>
        <head></head><body>
        {customer_name}<br>
        ご担当者様<br>
        <br>
        平素は大変お世話になっております。<br>
        株式会社アシスト AWS運営事務局です。<br>
        <br>
        この度は、弊社よりAWSアカウントのご契約をいただきまして<br>
        誠にありがとうございます。<br>
        <br>
        お客様のAWSアカウントID： <br>
        お客様のAWSアカウント名： ${InputValue["企業ドメイン名"][0]}_${InputValue["契約番号"][0]}E<br>
        <br>
        AWSサービスの利用開始にあたり、お客様にご対応いただきたい点がございます。<br>
        <br>
        大変お手数をおかけしますが、添付資料の「アカウント開設後のご対応について」を<br>
        ご確認いただき、必ず実施いただきますようお願いいたします。<br>
        ${manual_url}<br>
        ------------------------------<br>
        「アカウント開設後のご対応」内容<br>
        ・rootユーザパスワード設定手順<br>
        ・連絡先情報の変更<br>
        ・MFA設定手順<br>
        ・サポートプランのご変更<br>
        ------------------------------<br>
        手順内のご不明点、またその他ご相談事項などございましたら、<br>
        いつでもご連絡ください。<br>
        <br>
        今後とも何卒よろしくお願い申し上げます。<br>
        <br>
        ━━━━━━━━━━━━━━━━━━━━━━━━<br>
        株式会社アシスト<br>
        クラウド技術本部 AWS運営事務局<br>
        ${support_mail_address}<br>
        ━━━━━━━━━━━━━━━━━━━━━━━━<br>
        <br>
</html>
`;
    return txtbody;
};