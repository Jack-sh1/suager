# 1. 初始化 Git (如果之前没做过)
git init
git add .
git commit -m "feat: ready for deployment"

# 2. 关联远程仓库 (把 <URL> 换成你刚在 GitHub 创建的仓库地址)
git remote add origin https://github.com/jack-sh1/suger.git

# 3. 推送代码
git branch -M main
git push -u origin main

# 4. 🚀 一键部署！
pnpm run deploy
