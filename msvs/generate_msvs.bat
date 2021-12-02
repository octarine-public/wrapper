@echo off
cmake -G"Visual Studio 16 2019" -A Win32 -DCMAKE_C_COMPILER="clang" -DCMAKE_CXX_COMPILER="clang++" ..
pause