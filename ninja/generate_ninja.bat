@echo off

set EMSDK_PATH=C:/git/emsdk/upstream
set PATH=%EMSDK_PATH%/bin;%PATH%

:: ----------- NOSIMD --------------
CALL :create_ninja_files "NoSIMD"
:: ------------ SIMD ---------------
CALL :create_ninja_files "SIMD"
pause
EXIT /B %ERRORLEVEL%
:create_ninja_files
mkdir "%~1"
cd "%~1"
cmake -DCMAKE_BUILD_TYPE="%~1" -GNinja ^
	-DCMAKE_TOOLCHAIN_FILE="%EMSDK_PATH%/emscripten/cmake/Modules/Platform/Emscripten.cmake" ^
	../../
cd ../
EXIT /B 0