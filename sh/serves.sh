echo "开始部署..."

echo "git pull"
git pull

echo "pm2 restart"
npm run restart

echo "部署完成!"