@echo off

rem 接続情報
set PASS=%1
set HOSTNAME=eai-test-rds-01.cvs38wj0rbvv.ap-northeast-1.rds.amazonaws.com
set USERNAME=admin

mysql -p %PASS% -h %HOSTNAME% -u %USERNAME% -f < sqlファイル名 > sql_output.txt