// https://github.com/MattRickS/NukeScript/blob/master/ParticleRenderer/ParticleRenderer_SINGLEPIXEL_V01_01.cpp#L35
// https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-generating-camera-rays/generating-camera-rays
#include "stdafx.h"
#include <emscripten.h> // for EMSCRIPTEN_KEEPALIVE

#define EXPORT_JS /* avoid C++ mangling */ extern "C" /* export and don't inline */ EMSCRIPTEN_KEEPALIVE

void ComputeViewMatrix(VMatrix* pViewMatrix, const Vector& origin, const QAngle& angles) {
	static VMatrix baseRotation;
	static bool bDidInit;

	if (!bDidInit) {
		MatrixBuildRotationAboutAxis(baseRotation, Vector(1, 0, 0), -90);
		MatrixRotate(baseRotation, Vector(0, 0, 1), 90);
		bDidInit = true;
	}

	*pViewMatrix = baseRotation;
	MatrixRotate(*pViewMatrix, Vector(1, 0, 0), -angles[2]);
	MatrixRotate(*pViewMatrix, Vector(0, 1, 0), -angles[0]);
	MatrixRotate(*pViewMatrix, Vector(0, 0, 1), -angles[1]);
	MatrixTranslate(*pViewMatrix, -origin);
}

float ScaleFOVByWidthRatio(float fovDegrees, float ratio) {
	float halfAngleRadians = fovDegrees * DEG2RADf(.5f);
	return RAD2DEGf(atanf(tanf(halfAngleRadians) * ratio)) * 2.f;
}

FORCEINLINE int GetOtherMagic(Vector2D window_size, int input) {
	return floor((double)window_size.y / (double)0x300 * (double)input);
}

float GetFOVForWindowSize(Vector2D window_size) {
	if (window_size.x == 1280.f && window_size.y == 1024.f)
		window_size.y = 960.f;
	return ScaleFOVByWidthRatio(67.f, window_size.x / (window_size.y - (GetOtherMagic(window_size, 117) + GetOtherMagic(window_size, 31))) * 0.75f) /*(like division by 4:3)*/;
}

void ComputeViewMatrices(VMatrix* pWorldToView, VMatrix* pViewToProjection, VMatrix* pWorldToProjection, Vector& camera_pos, QAngle& camera_angles, Vector2D& window_size, double camera_distance) {
	ComputeViewMatrix(pWorldToView, camera_pos /* viewSetup.origin */, camera_angles /* viewSetup.angles */);
	// https://stackoverflow.com/a/2831560880.07724875735302
	float window_ratio = window_size.x / window_size.y;
	MatrixBuildPerspectiveX(*pViewToProjection, GetFOVForWindowSize(window_size), window_ratio, 7. /* viewSetup.zNear magic */, camera_distance * 2.);
	MatrixMultiply(*pViewToProjection, *pWorldToView, *pWorldToProjection);
}

void GetWorldToProjection(VMatrix& worldToProjection, Vector camera_pos, QAngle camera_angles, Vector2D window_size, double camera_distance) {
	VMatrix worldToView, viewToProjection;
	ComputeViewMatrices(&worldToView, &viewToProjection, &worldToProjection, camera_pos, camera_angles, window_size, camera_distance);
}

bool ScreenTransform(const Vector& point, Vector2D& screen, const VMatrix& worldToProjection) {
	screen = {
		worldToProjection[0][0] * point[0] + worldToProjection[0][1] * point[1] + worldToProjection[0][2] * point[2] + worldToProjection[0][3],
		worldToProjection[1][0] * point[0] + worldToProjection[1][1] * point[1] + worldToProjection[1][2] * point[2] + worldToProjection[1][3]
	};
	// z = worldToProjection[2][0] * point[0] + worldToProjection[2][1] * point[1] + worldToProjection[2][2] * point[2] + worldToProjection[2][3];
	float w = worldToProjection[3][0] * point[0] + worldToProjection[3][1] * point[1] + worldToProjection[3][2] * point[2] + worldToProjection[3][3];

	bool behind = w < 0.001f;
	if (!behind) {
		screen *= 1.f / w;
		screen.x = 0.5f + screen.x / 2.f;
		screen.y = 0.5f - screen.y / 2.f;
	}
	return !behind/* && (screen.x >= 0.f && screen.x <= 1) && (screen.z >= 0.f && screen.z <= 1)*/;
}

void WorldTransform(const Vector2D& screen, Vector& point, const VMatrix& projectionToWorld) {
	point = {
		projectionToWorld[0][0] * screen[0] + projectionToWorld[0][1] * screen[1] + projectionToWorld[0][3],
		projectionToWorld[1][0] * screen[0] + projectionToWorld[1][1] * screen[1] + projectionToWorld[1][3],
		projectionToWorld[2][0] * screen[0] + projectionToWorld[2][1] * screen[1] + projectionToWorld[2][3]
	};
	
	float w = projectionToWorld[3][0] * screen[0] + projectionToWorld[3][1] * screen[1] + projectionToWorld[3][3];
	point *= 1.f / w;
}

float JSIOBuffer[64];
FORCEINLINE Vector2D UnwrapVector2(int offset = 0) {
	return *(Vector2D*)&JSIOBuffer[offset];
}
FORCEINLINE Vector UnwrapVector3(int offset = 0) {
	return *(Vector*)&JSIOBuffer[offset];
}

EXPORT_JS float* GetIOBuffer() {
	return &JSIOBuffer[0];
}

VMatrix worldToProjection;
EXPORT_JS void CacheFrame() {
	auto camera_pos = UnwrapVector3();
	auto camera_ang = UnwrapVector3(3);
	auto camera_dist = JSIOBuffer[6];
	auto window_size = UnwrapVector2(7);
	GetWorldToProjection(worldToProjection, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
}

EXPORT_JS bool WorldToScreenCached() {
	auto world_vec = UnwrapVector3();
	Vector2D screen_vec;
	if (ScreenTransform(world_vec, screen_vec, worldToProjection)) {
		JSIOBuffer[0] = screen_vec.x;
		JSIOBuffer[1] = screen_vec.y;
		return true;
	} else
		return false;
}

EXPORT_JS void ScreenToWorldCached() {
	auto screen = UnwrapVector2();
	VMatrix projectionToWorld;
	MatrixInverseGeneral(worldToProjection, projectionToWorld);
	Vector point;
	WorldTransform(screen, point, projectionToWorld);
	
	JSIOBuffer[0] = point.x;
	JSIOBuffer[1] = point.y;
	JSIOBuffer[2] = point.z;
}

EXPORT_JS bool WorldToScreen() {
	auto world_vec = UnwrapVector3();
	auto camera_pos = UnwrapVector3(3);
	auto camera_ang = UnwrapVector3(6);
	auto camera_dist = JSIOBuffer[9];
	auto window_size = UnwrapVector2(10);
	VMatrix worldToProjection;
	GetWorldToProjection(worldToProjection, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
	Vector2D screen_vec;
	if (ScreenTransform(world_vec, screen_vec, worldToProjection)) {
		screen_vec.CopyTo(JSIOBuffer);
		return true;
	} else
		return false;
}

EXPORT_JS void ScreenToWorld() {
	auto screen = UnwrapVector2();
	auto camera_pos = UnwrapVector3(2);
	auto camera_ang = UnwrapVector3(5);
	auto camera_dist = JSIOBuffer[8];
	auto window_size = UnwrapVector2(9);
	VMatrix projectionToWorld;
	GetWorldToProjection(projectionToWorld, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
	MatrixInverseGeneral(projectionToWorld, projectionToWorld);
	Vector point;
	WorldTransform(screen, point, projectionToWorld);
	point.CopyTo(JSIOBuffer);
}

// https://github.com/ValveSoftware/source-sdk-2013/blob/master/sp/src/mathlib/mathlib_base.cpp#L919-L959
// slightly modified with forward => dota GetEyeVector
void CameraAngleVectors(const QAngle& angles, Vector* forward = nullptr, Vector* right = nullptr, Vector* up = nullptr){
	float sr, sp, sy, cr, cp, cy;
	sincos(DEG2RADf(angles.pitch), sp, cp);
	sincos(DEG2RADf(angles.yaw), sy, cy);
	sincos(DEG2RADf(angles.roll), sr, cr);

	if (forward != nullptr) {
		forward->x = cp * cy;
		forward->y = cp - cy;
		forward->z = -sp;
	}
	if (right) {
		right->x = (-1*sr*sp*cy+-1*cr*-sy);
		right->y = (-1*sr*sp*sy+-1*cr*cy);
		right->z = -1*sr*cp;
	}

	if (up) {
		up->x = (cr*sp*cy+-sr*-sy);
		up->y = (cr*sp*sy+-sr*cy);
		up->z = cr*cp;
	}
}

FORCEINLINE Vector2D GetFarSize(Vector2D window_size, float fov) {
	Vector2D far_size;
	far_size.x = tanf(DEG2RADf(fov / 2.f));
	far_size.y = far_size.x / (window_size.x / window_size.y);
	return far_size;
}

Vector GetRayDirection(Vector2D screen, const QAngle& camera_angles, const Vector2D& window_size) {
	Vector vForward, vRight, vUp;
	CameraAngleVectors(camera_angles, &vForward, &vRight, &vUp);

	screen.x = screen.x * 2.f - 1.f;
	screen.y = 1.f - screen.y * 2.f;
	auto far_size = GetFarSize(window_size, GetFOVForWindowSize(window_size));
	Vector ray = vForward + vRight * (far_size.x * screen.x) + vUp * (far_size.y * screen.y);
	ray.NormalizeInPlace();
	return ray;
}

HeightMap height_map;
EXPORT_JS int ParseVHCG(uint8_t* data, size_t data_size) {
	height_map = HeightMap();
	auto ret = height_map.Parse(data, data_size);
	free(data);
	if (ret != HeightMapParseError::NONE)
		return ret;
	height_map.GetMinMapCoords().CopyTo(JSIOBuffer);
	height_map.GetMapSize().CopyTo(&JSIOBuffer[2]);
	return ret;
}

EXPORT_JS void GetHeightForLocation() {
	JSIOBuffer[0] = height_map.GetHeightForLocation(UnwrapVector2());
}

EXPORT_JS void GetSecondaryHeightForLocation() {
	JSIOBuffer[0] = height_map.GetSecondaryHeightForLocation(UnwrapVector2());
}

EXPORT_JS void ScreenToWorldFar() {
	auto screen = UnwrapVector2();
	auto window_size = UnwrapVector2(2);
	auto camera_position = UnwrapVector3(4);
	auto camera_angles = UnwrapVector3(7);
	auto camera_distance = JSIOBuffer[10];

	auto ray = GetRayDirection(screen, *(QAngle*)&camera_angles, window_size);
	
	auto cur_pos = camera_position;
	const float max_ray_dist = camera_distance * camera_distance;
	while (cur_pos.z > height_map.GetHeightForLocation(cur_pos.AsVector2D()) && cur_pos.Distance(camera_position) <= max_ray_dist)
		cur_pos += ray;
	cur_pos.CopyTo(JSIOBuffer);
}

char* ParseVTex(char* data, size_t data_size, int& w, int& h);
char* ParsePNG(char* data, size_t data_size, int& w, int& h);

EXPORT_JS void* my_malloc(size_t data_size) {
	return malloc(data_size);
}

EXPORT_JS void my_free(void* ptr) {
	return free(ptr);
}

EXPORT_JS char* ParseImage(char* data, size_t data_size) {
	char* res = nullptr;
	int w, h;
	// PNG magic: 89 50 4E 47 0D 0A 1A 0A
	if (*(uint64_t*)data == 0x0A1A0A0D474E5089) {
		// png for sure
		res = ParsePNG(data, data_size, w, h);
	} else {
		// probably vtex?
		res = ParseVTex(data, data_size, w, h);
	}
	*(uint32_t*)&JSIOBuffer[0] = w;
	*(uint32_t*)&JSIOBuffer[1] = h;
	free(data);
	return res;
}

#define ExtractResourceBlock(name) \
EXPORT_JS bool ExtractResourceBlock_##name(char* data, size_t data_size) { \
	auto block_data = ExtractBlockFromResource(data, data_size, #name); \
	if (block_data == nullptr) \
		return false; \
	*(uint32_t*)&JSIOBuffer[0] = (size_t)GetPointer(&block_data->offset, block_data->offset) - (size_t)data; \
	*(uint32_t*)&JSIOBuffer[1] = block_data->size; \
	return true; \
}

ExtractResourceBlock(DATA)
ExtractResourceBlock(NTRO)
ExtractResourceBlock(REDI)
ExtractResourceBlock(RERL)

// https://github.com/ValveSoftware/source-sdk-2013/blob/0d8dceea4310fde5706b3ce1c70609d72a38efdf/sp/src/tier1/generichash.cpp#L313
// someone please port it to JS >_<
EXPORT_JS uint32_t MurmurHash2(void* key, int len, uint32_t seed) {
	// 'm' and 'r' are mixing constants generated offline.
	// They're not really 'magic', they just happen to work well.
	const uint32_t m = 0x5bd1e995;
	const int r = 24;

	// Initialize the hash to a 'random' value
	uint32_t h = seed ^ len;

	// Mix 4 bytes at a time into the hash
	auto data = (const unsigned char*)key;
	while(len >= 4) {
		uint32_t k = *(uint32_t*)data;

		k *= m; 
		k ^= k >> r; 
		k *= m; 

		h *= m; 
		h ^= k;

		data += 4;
		len -= 4;
	}

	// Handle the last few bytes of the input array
	switch (len) {
		case 3:
			h ^= data[2] << 16;
		case 2:
			h ^= data[1] << 8;
		case 1:
			h ^= data[0];
			h *= m;
	}

	// Do a few final mixes of the hash to ensure the last few
	// bytes are well-incorporated.
	h ^= h >> 13;
	h *= m;
	h ^= h >> 15;

	free(key);

	return h;
}

// https://github.com/ValveSoftware/source-sdk-2013/blob/0d8dceea4310fde5706b3ce1c70609d72a38efdf/sp/src/tier1/generichash.cpp#L380
// someone please port it to JS >_<
EXPORT_JS void MurmurHash64(void* key, int len, uint32_t seed) {
	// 'm' and 'r' are mixing constants generated offline.
	// They're not really 'magic', they just happen to work well.
	const uint32_t m = 0x5bd1e995;
	const int r = 24;

	// Initialize the hash to a 'random' value
	uint32_t h1 = seed ^ len;
	uint32_t h2 = 0;

	// Mix 4 bytes at a time into the hash
	auto data = (const uint32_t*)key;
	while (len >= 8) {
		uint32_t k1 = *data++;
		k1 *= m; k1 ^= k1 >> r; k1 *= m;
		h1 *= m; h1 ^= k1;
		len -= 4;

		uint32_t k2 = *data++;
		k2 *= m; k2 ^= k2 >> r; k2 *= m;
		h2 *= m; h2 ^= k2;
		len -= 4;
	}

	if (len >= 4) {
		uint32_t k1 = *data++;
		k1 *= m; k1 ^= k1 >> r; k1 *= m;
		h1 *= m; h1 ^= k1;
		len -= 4;
	}

	// Handle the last few bytes of the input array
	switch (len) {
		case 3:
			h2 ^= ((uint8_t*)data)[2] << 16;
		case 2:
			h2 ^= ((uint8_t*)data)[1] << 8;
		case 1:
			h2 ^= ((uint8_t*)data)[0];
			h2 *= m;
	}

	h1 ^= h2 >> 18; h1 *= m;
	h2 ^= h1 >> 22; h2 *= m;
	h1 ^= h2 >> 17; h1 *= m;
	h2 ^= h1 >> 19; h2 *= m;

	free(key);

	*(uint64_t*)JSIOBuffer = (((uint64_t)h1) << 32) | h2;
}

EXPORT_JS void* DecompressLZ4(void* data, size_t size) {
	auto dst_len = *(uint32_t*)data;
	auto dst = malloc(dst_len);
	LZ4_decompress_safe(GetPointer<char>(data, 4), (char*)dst, (int)(size - 4), (int)dst_len);
	free(data);
	*(uint32_t*)&JSIOBuffer[0] = dst_len;
	return dst;
}
