#!/bin/bash
# サーバーの設定変更
sed -i 's/^HOSTNAME=[a-zA-Z0-9\.\-]*$/HOSTNAME=udemy-bash/g' /etc/sysconfig/network
hostname 'udemy-bash'
cp /usr/share/zoneinfo/Japan /etc/localtime
sed -i 's|^ZONE=[a-zA-Z0-9\.\-\"]*$|ZONE="Asia/Tokyo"|g' /etc/sysconfig/clock
echo "LANG=ja_JP.UTF-8" > /etc/sysconfig/i18n
# アパッチのインストール
sudo yum update -y
sudo yum install httpd -y
sudo service httpd start
sudo chkconfig httpd on
# index.htmlの設置
aws s3 cp s3://udemy-vpc/index.html /var/www/html
====