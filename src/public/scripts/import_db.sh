#   DOWNLOAD PREVIOUSLY SQL FILE
sudo curl https://raw.githubusercontent.com/mironalex00/armfirewall/master/src/public/db/armfirewall.sql > ~/armwall.sql
#   LOGIN AND EXECUTE
mysql -u root -pmanager < ~/armwall.sql