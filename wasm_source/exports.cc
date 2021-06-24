// https://github.com/MattRickS/NukeScript/blob/master/ParticleRenderer/ParticleRenderer_SINGLEPIXEL_V01_01.cpp#L35
// https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-generating-camera-rays/generating-camera-rays
#include "stdafx.h"
#include <zstd.h>
#include "lz4.h"

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
	float halfAngleRadians = DEG2RADf(fovDegrees) / 2.f;
	return RAD2DEGf(atanf(tanf(halfAngleRadians) * ratio)) * 2.f;
}

void FixWindowSize(Vector2D& window_size) {
	if (window_size.x == 1280.f && window_size.y == 1024.f)
		window_size.y = 960.f;
	else if (window_size.x == 720.f && window_size.y == 576.f)
		window_size.y = 540.f;
}

FORCEINLINE float GetFOVForWindowSize(Vector2D window_size) {
	return ScaleFOVByWidthRatio(66.f, window_size.x / window_size.y);
}

void ComputeViewMatrices(VMatrix* pWorldToView, VMatrix* pViewToProjection, VMatrix* pWorldToProjection, Vector& camera_pos, QAngle& camera_angles, Vector2D& window_size, double camera_distance) {
	ComputeViewMatrix(pWorldToView, camera_pos /* viewSetup.origin */, camera_angles /* viewSetup.angles */);
	FixWindowSize(window_size);
	float window_ratio = window_size.x / window_size.y;
	MatrixBuildPerspectiveX(
		*pViewToProjection,
		ScaleFOVByWidthRatio(66.f, window_ratio),
		window_ratio,
		7. /* viewSetup.zNear magic */,
		camera_distance * 10.
	);
	MatrixMultiply(*pViewToProjection, *pWorldToView, *pWorldToProjection);
}

void GetWorldToProjection(VMatrix& worldToProjection, Vector camera_pos, QAngle camera_angles, Vector2D window_size, double camera_distance) {
	VMatrix worldToView, viewToProjection;
	ComputeViewMatrices(&worldToView, &viewToProjection, &worldToProjection, camera_pos, camera_angles, window_size, camera_distance);
}

bool ScreenTransform(const Vector& point, int& x, int& y, int width, int height, const VMatrix& worldToProjection) {
	Vector2D screen = {
		worldToProjection[0][0] * point[0] + worldToProjection[0][1] * point[1] + worldToProjection[0][2] * point[2] + worldToProjection[0][3],
		worldToProjection[1][0] * point[0] + worldToProjection[1][1] * point[1] + worldToProjection[1][2] * point[2] + worldToProjection[1][3]
	};
	// z = worldToProjection[2][0] * point[0] + worldToProjection[2][1] * point[1] + worldToProjection[2][2] * point[2] + worldToProjection[2][3];
	float w = worldToProjection[3][0] * point[0] + worldToProjection[3][1] * point[1] + worldToProjection[3][2] * point[2] + worldToProjection[3][3];

	bool behind = w < 0.001f;
	if (!behind) {
		screen /= w * 2.f;
		x = screen.x * width;
		x += width / 2.f;
		y = -screen.y * height;
		y += height / 2.f;
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

EXPORT_JS bool WorldToScreen() {
	auto world_vec = UnwrapVector3();
	auto camera_pos = UnwrapVector3(3);
	auto camera_ang = UnwrapVector3(6);
	auto camera_dist = JSIOBuffer[9];
	auto window_size = UnwrapVector2(10);
	VMatrix worldToProjection;
	GetWorldToProjection(worldToProjection, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
	int x, y;
	if (ScreenTransform(world_vec, x, y, window_size.x, window_size.y, worldToProjection)) {
		JSIOBuffer[0] = x;
		JSIOBuffer[1] = y;
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
void CameraAngleVectors(const QAngle& angles, Vector* forward = nullptr, Vector* right = nullptr, Vector* up = nullptr) {
	float sr, sp, sy, cr, cp, cy;
	sincos(DEG2RADf(angles.pitch), sp, cp);
	sincos(DEG2RADf(angles.yaw), sy, cy);
	sincos(DEG2RADf(angles.roll), sr, cr);

	if (forward != nullptr) {
		forward->x = cp*cy;
		forward->y = cp*sy;
		forward->z = -sp;
	}

	if (right != nullptr) {
		right->x = (-1*sr*sp*cy+-1*cr*-sy);
		right->y = (-1*sr*sp*sy+-1*cr*cy);
		right->z = -1*sr*cp;
	}

	if (up != nullptr) {
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

HeightMap height_map;
bool height_map_initialized = false;
EXPORT_JS int ParseVHCG(uint8_t* data, size_t data_size) {
	height_map_initialized = false;
	height_map = {};
	auto ret = height_map.Parse(data, data_size);
	free(data);
	if (ret != HeightMapParseError::NONE)
		return ret;
	height_map_initialized = true;
	height_map.GetMinMapCoords().CopyTo(JSIOBuffer);
	height_map.GetMapSize().CopyTo(&JSIOBuffer[2]);
	return ret;
}

extern bool RayTraceInitialized();
extern std::optional<Vector> TryRayTrace(Vector camera_position, Vector ray_direction);
float GetHeightForLocation(Vector2D loc) {
	if (RayTraceInitialized()) {
		Vector camera_position{ loc.x, loc.y, 10000 };
		Vector ray_direction{ 0.f, 0.f, -1.f };
		auto res = TryRayTrace(camera_position, ray_direction);
		return res ? res->z : -16384.f;
	}
	return height_map_initialized
		? height_map.GetHeightForLocation(loc)
		: -16384.f;
}
EXPORT_JS void GetHeightForLocation() {
	JSIOBuffer[0] = GetHeightForLocation(UnwrapVector2());
}

EXPORT_JS void GetLocationAverageHeight() {
	auto pos = UnwrapVector2();
	auto count = (int)JSIOBuffer[2];
	auto dist = JSIOBuffer[3];

	float height_sum = 0.f;
	int height_count = 0;
	for (int x = 0; x < count; x++) {
		for (int y = 0; y < count; y++) {
			auto height = GetHeightForLocation(pos);
			if (height > -1000) {
				height_sum += height;
				height_count++;
			}
			pos.y += dist;
		}
		pos.x += dist;
	}
	JSIOBuffer[0] = height_sum / height_count;
}

EXPORT_JS void ScreenToWorldFar() {
	auto window_size = UnwrapVector2();
	auto camera_position = UnwrapVector3(2);
	auto camera_angles = UnwrapVector3(5);
	auto camera_distance = JSIOBuffer[8];
	auto fov = JSIOBuffer[9];
	auto screens_count = (int)JSIOBuffer[10];
	if (screens_count == 0)
		return;
	
	Vector vForward, vRight, vUp;
	CameraAngleVectors(*(QAngle*)&camera_angles, &vForward, &vRight, &vUp);
	FixWindowSize(window_size);
	if (fov <= 0.f)
		fov = GetFOVForWindowSize(window_size);
	auto far_size = GetFarSize(window_size, fov);

	auto screens_results = new Vector[screens_count];
	bool initialized = RayTraceInitialized();
	for (int i = 0; i < screens_count; i++) {
		auto screen = UnwrapVector2(11 + i * 2);
		screen.x = screen.x * 2.f - 1.f;
		screen.y = 1.f - screen.y * 2.f;
		Vector ray = vForward + vRight * (far_size.x * screen.x) + vUp * (far_size.y * screen.y);
		ray.NormalizeInPlace();
		auto& cur_pos = screens_results[i];
		if (!initialized) {
			if (height_map_initialized) {
				cur_pos = camera_position;
				ray *= 10.f;
				const float max_ray_dist = camera_distance * 10; // far plane
				while (
					cur_pos.z > height_map.GetHeightForLocation(cur_pos.AsVector2D())
					&& cur_pos.Distance(camera_position) <= max_ray_dist
				)
					cur_pos += ray;
			} else
				cur_pos.Invalidate();
		} else {
			auto pos = TryRayTrace(camera_position, ray);
			if (pos)
				cur_pos = *pos;
			else
				cur_pos.Invalidate();
		}
	}
	memcpy(JSIOBuffer, screens_results, screens_count * sizeof(*screens_results));
	delete[] screens_results;
}

EXPORT_JS void* my_malloc(size_t data_size) {
	return malloc(data_size);
}

EXPORT_JS void my_free(void* ptr) {
	return free(ptr);
}

char* ParsePNGInternal(char* data, size_t data_size, int& w, int& h);
EXPORT_JS char* ParsePNG(char* data, size_t data_size) {
	int w, h;
	auto res = ParsePNGInternal(data, data_size, w, h);
	*(uint32_t*)&JSIOBuffer[0] = w;
	*(uint32_t*)&JSIOBuffer[1] = h;
	free(data);
	return res;
}

char* ParseVTexInternal(
	char* data,
	size_t data_size,
	char* image_data,
	int& w,
	int& h,
	bool is_YCoCg,
	bool normalize,
	bool is_inverted,
	bool hemi_oct,
	bool hemi_oct_RB
);
EXPORT_JS char* ParseVTex(
	char* data,
	size_t data_size,
	char* image_data,
	bool is_YCoCg,
	bool normalize,
	bool is_inverted,
	bool hemi_oct,
	bool hemi_oct_RB
) {
	int w, h;
	auto res = ParseVTexInternal(
		data,
		data_size,
		image_data,
		w,
		h,
		is_YCoCg,
		normalize,
		is_inverted,
		hemi_oct,
		hemi_oct_RB
	);
	*(uint32_t*)&JSIOBuffer[0] = w;
	*(uint32_t*)&JSIOBuffer[1] = h;
	free(data);
	return res;
}

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

EXPORT_JS uint32_t CRC32(void* data, int len) {
	auto ret = crc32((const char*)data, (size_t)len);
	free(data);
	return ret;
}

EXPORT_JS void* DecompressLZ4(void* data, size_t size, size_t dst_len) {
	auto dst = malloc(dst_len);
	LZ4_decompress_safe((char*)data, (char*)dst, (int)size, (int)dst_len);
	free(data);
	return dst;
}

EXPORT_JS void* DecompressZstd(void* data, size_t size) {
	/*if (size < 4)
		return nullptr;
	auto dst_len = ZSTD_getFrameContentSize(data, size);
	if (dst_len == ZSTD_CONTENTSIZE_ERROR || dst_len == ZSTD_CONTENTSIZE_ERROR)
		return nullptr;
	auto dst = malloc(dst_len);
	if (ZSTD_decompress(dst, dst_len, data, size) != dst_len) {
		free(dst);
		return nullptr;
	}
	*(uint32_t*)data = dst_len;
	return dst;*/
	return nullptr;
}

EXPORT_JS void* DecompressLZ4Chained(void* data, uint32_t* input_sizes, uint32_t* output_sizes, uint32_t count) {
	size_t dst_len = 0;
	for (uint32_t i = 0; i < count; i++)
		dst_len += output_sizes[i];
	auto dst = malloc(dst_len);
	auto current_src = (char*)data;
	auto current_dst = (char*)dst;
    LZ4_streamDecode_t lz4StreamDecode{};
	for (uint32_t i = 0; i < count; i++) {
		auto input_size = input_sizes[i],
			output_size = output_sizes[i];
		LZ4_decompress_safe_continue(&lz4StreamDecode, current_src, current_dst, (int)input_size, (int)output_size);
		current_src = GetPointer<char>(current_src, input_size);
		current_dst = GetPointer<char>(current_dst, output_size);
	}
	free(data);
	free(input_sizes);
	free(output_sizes);
	return dst;
}

VMatrix SavedWorldToProjection;
EXPORT_JS void CloneWorldToProjection() {
	memcpy(SavedWorldToProjection.m, JSIOBuffer, sizeof(SavedWorldToProjection.m));
}
EXPORT_JS bool WorldToScreenNew() {
	auto world_vec = UnwrapVector3();
	auto window_size = UnwrapVector2(3);
	int x, y;
	if (ScreenTransform(world_vec, x, y, window_size.x, window_size.y, SavedWorldToProjection)) {
		JSIOBuffer[0] = x;
		JSIOBuffer[1] = y;
		return true;
	} else
		return false;
}

EXPORT_JS void* DecompressVertexBuffer(
	uint8_t* data,
	size_t size,
	size_t out_elem_count,
	size_t out_elem_size
) {
	auto out = calloc(out_elem_count, out_elem_size);
	meshopt_decodeVertexBuffer(out, out_elem_count, out_elem_size, data, size);
	free(data);
	return out;
}

EXPORT_JS void* DecompressIndexBuffer(
	uint8_t* data,
	size_t size,
	size_t out_elem_count,
	size_t out_elem_size
) {
	auto out = calloc(out_elem_count, out_elem_size);
	if (out_elem_size == 4)
		meshopt_decodeIndexBuffer((uint32_t*)out, out_elem_count, data, size);
	else if (out_elem_size == 2)
		meshopt_decodeIndexBuffer((uint16_t*)out, out_elem_count, data, size);
	free(data);
	return out;
}

extern void ResetWorldInternal();
EXPORT_JS void ResetWorld() {
	ResetWorldInternal();
}

extern void LoadWorldModelInternal(
	std::string_view vertex_data, size_t vertex_size,
	std::string_view index_data, size_t index_size,
	VMatrix transform
);
EXPORT_JS void LoadWorldModel(
	void* vertex_ptr, size_t vertex_size, size_t vertex_elem_size,
	void* index_ptr, size_t index_size, size_t index_elem_size
) {
	LoadWorldModelInternal(
		{ (const char*)vertex_ptr, vertex_size }, vertex_elem_size,
		{ (const char*)index_ptr, index_size }, index_elem_size,
		*(VMatrix*)JSIOBuffer
	);
	free(vertex_ptr);
	free(index_ptr);
}

extern void FinishWorldInternal();
EXPORT_JS void FinishWorld() {
	FinishWorldInternal();
}
extern void FinishWorldCachedInternal(std::string_view cached_nodes, std::string_view cached_indices);
EXPORT_JS void FinishWorldCached(
	void* nodes_ptr, size_t nodes_size,
	void* indices_ptr, size_t indices_size
) {
	FinishWorldCachedInternal(
		{ (const char*)nodes_ptr, nodes_size },
		{ (const char*)indices_ptr, indices_size }
	);
	free(nodes_ptr);
	free(indices_ptr);
}

extern std::pair<std::string_view, std::string_view> ExtractWorldVBIBInternal();
extern std::pair<std::string_view, std::string_view> ExtractWorldBVHInternal();
EXPORT_JS void ExtractWorld() {
	auto [vb, ib] = ExtractWorldVBIBInternal();
	static_assert(sizeof(uint32_t) == sizeof(void*));
	*(uint32_t*)&JSIOBuffer[0] = (uint32_t)vb.data();
	*(uint32_t*)&JSIOBuffer[1] = (uint32_t)vb.size();
	*(uint32_t*)&JSIOBuffer[2] = (uint32_t)ib.data();
	*(uint32_t*)&JSIOBuffer[3] = (uint32_t)ib.size();
	auto [bvh1, bvh2] = ExtractWorldBVHInternal();
	*(uint32_t*)&JSIOBuffer[4] = (uint32_t)bvh1.data();
	*(uint32_t*)&JSIOBuffer[5] = (uint32_t)bvh1.size();
	*(uint32_t*)&JSIOBuffer[6] = (uint32_t)bvh2.data();
	*(uint32_t*)&JSIOBuffer[7] = (uint32_t)bvh2.size();
}

int main() {
	return 0;
}
