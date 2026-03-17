@echo off
chcp 65001 >nul
echo ========================================
echo    技术博客 - 依赖安装
echo ========================================
cd /d "%~dp0"
echo 正在安装依赖...
npm install
if %errorlevel% equ 0 (
  echo.
  echo ========================================
  echo    安装成功！
  echo    运行 dev.bat 启动开发服务器
  echo ========================================
) else (
  echo 安装失败，请检查 npm 是否安装正确
)
pause
