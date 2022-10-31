cd 'admin-blog'
echo "开始部署..."

echo "git pull"
git pull

echo "npm run build"
npm run build:prod


echo "部署完成!"
