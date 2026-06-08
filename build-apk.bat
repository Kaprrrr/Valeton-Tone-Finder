@echo off
set GRADLE_USER_HOME=C:\Users\Chris\.gradle
cd /d D:\DEV\VTF\android
call gradlew.bat assembleRelease
echo.
echo BUILD COMPLETE
echo APK location: D:\DEV\VTF\android\app\build\outputs\apk\release\app-release.apk
