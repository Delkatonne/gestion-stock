@echo off
echo ========================================
echo   COMPILATION - GESTION DE STOCK (C++)
echo ========================================
echo.

echo Compilation en cours...
g++ -std=c++17 -Iinclude src/main.cpp src/models/*.cpp src/repository/*.cpp src/service/*.cpp src/ui/*.cpp -o gestion_stock.exe

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo   ✓ COMPILATION REUSSIE !
    echo ========================================
    echo.
    echo Lancement de l'application...
    echo.
    gestion_stock.exe
) else (
    echo.
    echo ========================================
    echo   ✗ ERREUR DE COMPILATION !
    echo ========================================
    echo.
    echo Veuillez corriger les erreurs ci-dessus.
    pause
)