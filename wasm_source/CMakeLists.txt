project(wasm_source CXX)

set(LZ4_PATH "C:/git/lz4")
include_directories(${LZ4_PATH}/lib)
include_directories(zstd/lib)
include_directories(meshoptimizer/src)
include_directories(${PROJECT_SOURCE_DIR})
add_subdirectory(bvh)

################################################################################
# Source groups
################################################################################
set(Header_Files
	crc32.h
	reader.h
	stdafx.h
	Vector.h
	vhcg.h
	vmatrix.h
)
source_group("Header Files" FILES ${Header_Files})

set(Source_Files__Third_party__LZ4
	${LZ4_PATH}/lib/lz4.cc
	${LZ4_PATH}/lib/lz4hc.cc
)
source_group("Source Files\\Third party\\LZ4" FILES ${Source_Files__Third_party__LZ4})

file(GLOB Source_Files__Third_party__zstd
	"zstd/lib/common/*.c"
	"zstd/lib/decompress/*.c"
)
source_group("Source Files\\zstd" FILES ${Source_Files__Third_party__zstd})

set(Source_Files__Third_party__lodepng
	lodepng/lodepng.cpp
)
source_group("Source Files\\Third party\\lodepng" FILES ${Source_Files__Third_party__lodepng})

file(GLOB Source_Files__Third_party__meshoptimizer
	"meshoptimizer/src/*.cpp"
)
source_group("Source Files\\meshoptimizer" FILES ${Source_Files__Third_party__meshoptimizer})

set(Source_Files
	exports.cc
	image_utils.cc
	valve_s3tc.cc
	vhcg.cc
	vmatrix.cc
	world_sim.cc
)
source_group("Source Files" FILES ${Source_Files})

set(ALL_FILES
	${Header_Files}
	${Source_Files__Third_party__LZ4}
	${Source_Files__Third_party__zstd}
	${Source_Files__Third_party__lodepng}
	${Source_Files__Third_party__meshoptimizer}
	${Source_Files}
)

################################################################################
# Target
################################################################################
add_executable(${PROJECT_NAME} ${ALL_FILES})

################################################################################
# Target name & output directory
################################################################################
set_target_properties(${PROJECT_NAME} PROPERTIES
	RUNTIME_OUTPUT_NAME_NOSIMD	"wrapper.wasm"
	RUNTIME_OUTPUT_NAME_SIMD	"wrapper_simd.wasm"
	RUNTIME_OUTPUT_DIRECTORY	"${CMAKE_SOURCE_DIR}/scripts_files/"
)

################################################################################
# Compile definitions
################################################################################
set(DEFAULT_PREPROCESSOR_DEFS
	"LODEPNG_NO_COMPILE_ENCODER;"
	"LODEPNG_NO_COMPILE_DISK;"
	"LODEPNG_NO_COMPILE_ERROR_TEXT;"
)
target_compile_definitions(${PROJECT_NAME} PRIVATE
	"$<$<CONFIG:SIMD>:"
		"${DEFAULT_PREPROCESSOR_DEFS}"
		"NDEBUG;"
	">"
	"$<$<CONFIG:NoSIMD>:"
		"${DEFAULT_PREPROCESSOR_DEFS}"
		"NDEBUG;"
	">"
)

################################################################################
# Compile and link options
################################################################################
set(DEFAULT_COMPILER_OPTIONS
	-finline-functions;
	# -Wunused-variable; # commented out because of meshoptimizer
	# -Wunused-function; # commented out because of meshoptimizer
	-Werror;
	-fstrict-vtable-pointers;
	-funroll-loops;
	-finline;
	-fcolor-diagnostics;
	-fmerge-all-constants;
	-fvisibility=hidden;
	-fdata-sections;
	-ffunction-sections;
	-flto=thin;
	-fsplit-lto-unit;
	-g0;
	-mbulk-memory;
	-matomics;
	# -pthread;
)
if (MSVC)
	set(DEFAULT_COMPILER_OPTIONS
		${DEFAULT_COMPILER_OPTIONS}
		/Zc:__cplusplus;
	)
endif()
set(DEFAULT_COMPILER_OPTIONS_RELEASE
	${DEFAULT_COMPILER_OPTIONS}
	-O3;
	-fno-stack-protector;
	-fno-exceptions;
	-fno-unwind-tables;
)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_20)
target_compile_options(${PROJECT_NAME} PRIVATE
	$<$<CONFIG:NoSIMD>:
		${DEFAULT_COMPILER_OPTIONS_RELEASE}
	>
	$<$<CONFIG:SIMD>:
		${DEFAULT_COMPILER_OPTIONS_RELEASE}
		-msimd128;
	>
)

set(DEFAULT_LINKER_OPTIONS_RELEASE
	# -Wl,--import-memory;
	# -Wl,--shared-memory;
	# -s; USE_PTHREADS;
	-s; ALLOW_MEMORY_GROWTH=1;
	-g0;
)
target_link_options(${PROJECT_NAME} PRIVATE
	$<$<CONFIG:NoSIMD>:
		${DEFAULT_LINKER_OPTIONS_RELEASE}
	>
	$<$<CONFIG:SIMD>:
		${DEFAULT_LINKER_OPTIONS_RELEASE}
	>
)

################################################################################
# Dependencies
################################################################################
set(DEFAULT_LIBS
	"bvh;"
)
string(CONCAT ADDITIONAL_LIBRARY_DEPENDENCIES
	"$<$<CONFIG:NoSIMD>:"
		"${DEFAULT_LIBS}"
	">"
	"$<$<CONFIG:SIMD>:"
		"${DEFAULT_LIBS}"
	">"
)
target_link_libraries(${PROJECT_NAME} PUBLIC "${ADDITIONAL_LIBRARY_DEPENDENCIES}")
