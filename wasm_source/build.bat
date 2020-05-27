@em++ -std=c++17 -O3 -s ALLOW_MEMORY_GROWTH=1 -o ../scripts_files/wrapper.wasm ^
	lz4.cc ^
	exports.cc ^
	vhcg.cc ^
	vmatrix.cc ^
	image_utils.cc ^
	resource_utils.cc ^
	valve_s3tc.cc ^
	lodepng/lodepng.cpp ^
	lodepng/lodepng_util.cpp
