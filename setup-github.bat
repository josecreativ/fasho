@echo off
echo Setting up GitHub repository for Allure Fashion E-commerce...
echo.

git init
git add .
git commit -m "Initial commit - Allure Fashion E-commerce App"
git branch -M main

echo.
echo Repository initialized!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub.com named: allure-fashion-ecommerce
echo 2. Copy the repository URL
echo 3. Run: git remote add origin [YOUR-REPO-URL]
echo 4. Run: git push -u origin main
echo.
pause