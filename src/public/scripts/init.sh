#!/bin/bash

echo =============================================
echo =              _Updating System_            =
echo =============================================
sudo apt update && sudo apt upgrade -y
clear
echo =============================================
echo =  _Installing curl \(Skipping existing\)_  =
echo =============================================
sudo apt install curl -y
clear
echo =============================================
echo =          _Setting up nodejs files_        =
echo =============================================
sudo curl -s https://deb.nodesource.com/setup_16.x | sudo bash | exit
clear
echo =============================================
echo =       _Installing nodejs and npm_         =
echo =============================================
sudo apt install nodejs npm -y
clear
echo =============================================
echo =          _Installing mariadb_             =
echo =============================================
sudo apt install mariadb-server -y
clear
echo =============================================
echo =        _Setting up mariadb_               =
echo =============================================
sudo curl https://gist.githubusercontent.com/Mins/4602864/raw/mysql_secure.sh > ~/init_mysql.sh
sudo chmod -x ~/init_mysql.sh
sed -i -e 's/abcd1234/manager/g' ~/init_mysql.sh
sed -i -e 's/change/Set/g' ~/init_mysql.sh
sed -i -e 's/aptitude/sudo apt/g' ~/init_mysql.sh
echo "sudo service mysql restart" >> ~/init_mysql.sh
if (sudo bash ~/init_mysql.sh) then
	clear
	echo =============================================
	echo =        _Success setting up mariadb_       =
	echo =============================================
else
	echo =============================================
	echo =        _Error setting up mariadb_         =
	echo =============================================
fi
sudo rm ~/init_mysql.sh
sleep 2
clear
echo =============================================
echo =         _Setting up user armwall_         =
echo =============================================
sudo userdel -r armwall
sudo useradd -m  -p "sa/76JbggCTAw" armwall
sudo usermod -aG sudo armwall
[ $? -eq 0 ] && echo "User has been added to system!" || echo "Failed to add a user!"
if [ ! -f /etc/sudoers.bak ]
then
	echo "Sudoers backup file doesnt exist, backing up..."
	sudo cp /etc/sudoers /etc/sudoers.bak
    echo "Replacing info because script..."
	sudo rm /etc/sudoers
    sudo cp /etc/sudoers.bak /etc/sudoers
else
 sudo echo "armwall	ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers
fi
sleep 2
clear
echo =============================================
echo =             _Setup complete_             =
echo =============================================
read -p "Press enter to continu"e
exit 0