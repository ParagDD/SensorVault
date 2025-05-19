@echo off
echo ===================================
echo SensoVault Frontend Deployment Tool
echo ===================================
echo.

echo Step 1: Installing Vercel CLI (if not already installed)
call npm install -g vercel
echo.

echo Step 2: Building the project
call npm run build
echo.

echo Step 3: Deploying to Vercel
echo Note: You may need to login to Vercel if not already logged in
echo.

echo Choose deployment option:
echo 1. Deploy with current settings
echo 2. Deploy with production settings
echo 3. Deploy with custom settings
echo.

set /p option="Enter option (1-3): "

if "%option%"=="1" (
  echo Deploying with current settings...
  call vercel
) else if "%option%"=="2" (
  echo Deploying to production...
  call vercel --prod
) else if "%option%"=="3" (
  echo Deploying with custom settings...
  call vercel
) else (
  echo Invalid option. Exiting...
  exit /b 1
)

echo.
echo Deployment complete! Check the URL above to access your deployed application.
echo. 