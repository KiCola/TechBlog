@echo off
chcp 65001 >nul
echo ========================================
echo    技术博客 - 构建静态文件
echo ========================================
cd /d "%~dp0"
npm run build
if %errorlevel% equ 0 (
  echo.
  echo ========================================
  echo    构建成功！静态文件在 out/ 目录
  echo    现在可以 push 到 GitHub 部署
  echo ========================================
) else (
  echo 构建失败，请检查错误信息
)
pause

