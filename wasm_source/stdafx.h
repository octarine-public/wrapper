#pragma once

#include <math.h>
#include <stdint.h>
#include <string_view>
#include <vector>
#include <optional>
#include <array>
#include <stdlib.h> // for malloc
#include <assert.h> // for assert

#ifdef _MSC_VER
#define FORCEINLINE __forceinline
#define WASM_EXPORT(name)
#else
#define FORCEINLINE __attribute__((always_inline)) inline
#define WASM_EXPORT(name) __attribute__((export_name(#name)))
#endif

constexpr double PId = 3.1415;
constexpr float PIf = 3.1415f;
constexpr auto PI = PIf;
FORCEINLINE constexpr float DEG2RADf(float deg) { return deg * PIf / 180.f; }
FORCEINLINE constexpr float RAD2DEGf(float rad) { return rad * 180.f / PIf; }
FORCEINLINE constexpr double DEG2RADd(double deg) { return deg * PId / 180.; }
FORCEINLINE constexpr double RAD2DEGd(double rad) { return rad * 180. / PId; }
template<typename T> FORCEINLINE void sincos(T val, T& sin_out, T& cos_out) {
	sin_out = sin(val);
	cos_out = cos(val);
}
template<typename T = void, typename X = T> FORCEINLINE T* GetPointer(X* base, int64_t offset) {
	return (T*)(((int8_t*)base) + offset);
}

#define VECTOR_NO_SLOW_OPERATIONS
#include "meshoptimizer/src/meshoptimizer.h"
#include "Vector.h"
#include "vhcg.h"
#include "vmatrix.h"
#include "crc32.h"
