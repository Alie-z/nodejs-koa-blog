cd 'frontend-boblog'
echo "开始部署..."

echo "git pull"
git pull

echo "npm run build"
npm run build

echo "pm2 restart"
npm run restart

echo "部署完成!"