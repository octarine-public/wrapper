cmake_minimum_required(VERSION 3.13.0 FATAL_ERROR)

project(wrapper)

################################################################################
# Set target arch type if empty. Visual studio solution generator provides it.
################################################################################
set(CMAKE_EXECUTABLE_SUFFIX "")
set(CMAKE_GENERATOR_PLATFORM x86)
message("${CMAKE_GENERATOR_PLATFORM} architecture in use")

if(NOT ("${CMAKE_GENERATOR_PLATFORM}" STREQUAL "x86"))
	message(FATAL_ERROR "${CMAKE_GENERATOR_PLATFORM} arch is not supported!")
endif()

################################################################################
# Global configuration types
################################################################################
set(CMAKE_CONFIGURATION_TYPES
	"NoSIMD"
	"SIMD"
	CACHE STRING "" FORCE
)

################################################################################
# Global compiler options
################################################################################
set(CMAKE_CXX_FLAGS "")
set(CMAKE_CXX_FLAGS_NOSIMD "")
set(CMAKE_CXX_FLAGS_SIMD "")

################################################################################
# Global linker options
################################################################################
set(CMAKE_SHARED_LINKER_FLAGS "")
set(CMAKE_SHARED_LINKER_FLAGS_NOSIMD "")
set(CMAKE_SHARED_LINKER_FLAGS_SIMD "")

################################################################################
# Use solution folders feature
################################################################################
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

################################################################################
# Global variables
################################################################################

################################################################################
# Sub-projects
################################################################################
add_subdirectory(wasm_source)
