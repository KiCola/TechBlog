@echo off
chcp 65001 >nul
echo ========================================
echo    技术博客 - 开发服务器
echo    访问: http://localhost:3000
echo ========================================
cd /d "%~dp0"
npm run dev

