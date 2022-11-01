
echo "git pull"
git pull

echo "serve install"
yarn

echo "serve install 完成"

cd 'admin-blog'
echo "admin install"
yarn

echo "admin install 完成"

cd 'frontend-boblog'
echo "frontend install"
yarn

echo "frontend install 完成"
