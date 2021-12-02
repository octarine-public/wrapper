@echo off
ninja -C NoSIMD -j 24
ninja -C SIMD -j 24
pause