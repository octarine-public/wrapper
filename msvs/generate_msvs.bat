@echo off

set EMSDK_PATH=C:/git/emsdk/upstream
set PATH=%EMSDK_PATH%/bin;%PATH%

cmake -G"Visual Studio 16 2019" -A Win32 ^
	-DCMAKE_TOOLCHAIN_FILE="%EMSDK_PATH%/emscripten/cmake/Modules/Platform/Emscripten.cmake" ^
	..

pause