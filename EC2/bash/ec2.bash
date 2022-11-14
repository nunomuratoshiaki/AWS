#!/bin/bash
sed -i 's/^HOMENAME=[a-zA-Z0-9\.\-]*$/HOMENAME=inspection-ec2/g' /etc/sysconfig/network
hostname 'inspection-ec2'
cp /usr/share/zoneinfo/Japan /etc/localtime
sed -i 's|^ZONE=[a-zA-Z0-9\.\-\"]*$|ZONE="Asia/Tokyo"|g' /etc/sysconfig/clock
echo "LANG=ja_JP.UTF-8" > /etc/sysconfig/i18n
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
wget https://download.oracle.com/otn_software/linux/instantclient/19600/oracle-instantclient19.6-basic-19.6.0.0.0-1.x86_64.rpm
wget https://download.oracle.com/otn_software/linux/instantclient/19600/oracle-instantclient19.6-sqlplus-19.6.0.0.0-1.x86_64.rpm
sudo yum install -y oracle-instantclient19.6-basic-19.6.0.0.0-1.x86_64.rpm
sudo yum install -y oracle-instantclient19.6-sqlplus-19.6.0.0.0-1.x86_64.rpm
yum install -y mysql
yum install -y postgresql
sudo amazon-linux-extras install -y  collectd