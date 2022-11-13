// https://github.com/MattRickS/NukeScript/blob/master/ParticleRenderer/ParticleRenderer_SINGLEPIXEL_V01_01.cpp#L35
// https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-generating-camera-rays/generating-camera-rays
#include "stdafx.h"

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

float JSIOBuffer[129];
FORCEINLINE Vector2D& UnwrapVector2(int offset = 0) {
	return *(Vector2D*)&JSIOBuffer[offset];
}
FORCEINLINE Vector& UnwrapVector3(int offset = 0) {
	return *(Vector*)&JSIOBuffer[offset];
}

WASM_EXPORT(GetIOBuffer) float* GetIOBuffer() {
	return &JSIOBuffer[0];
}

WASM_EXPORT(WorldToScreen) bool WorldToScreen() {
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

WASM_EXPORT(ScreenToWorld) void ScreenToWorld() {
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
WASM_EXPORT(ParseVHCG) int ParseVHCG(uint8_t* data, size_t data_size) {
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
extern std::optional<RayTraceResult> TryRayTrace(Vector camera_position, Vector ray_direction, uint32_t flags);
float GetHeightForLocation(Vector2D loc, uint32_t flags) {
	if (RayTraceInitialized()) {
		Vector camera_position{ loc.x, loc.y, 10000 };
		Vector ray_direction{ 0.f, 0.f, -1.f };
		auto res = TryRayTrace(camera_position, ray_direction, flags);
		return res ? res->pos.z : -16384.f;
	}
	return height_map_initialized
		? height_map.GetHeightForLocation(loc)
		: -16384.f;
}
WASM_EXPORT(GetHeightForLocation) void GetHeightForLocation() {
	auto flags = *(uint32_t*)&JSIOBuffer[2];
	JSIOBuffer[0] = GetHeightForLocation(UnwrapVector2(), flags);
}

WASM_EXPORT(GetLocationAverageHeight) void GetLocationAverageHeight() {
	auto pos = UnwrapVector2();
	auto flags = *(uint32_t*)&JSIOBuffer[2];
	auto count = (int)JSIOBuffer[3];
	auto dist = JSIOBuffer[4];

	float height_sum = 0.f;
	int height_count = 0;
	for (int x = -count; x <= count; x++) {
		for (int y = -count; y <= count; y++) {
			auto height = GetHeightForLocation({
				pos.x + x * dist,
				pos.y + y * dist,
			}, flags);
			if (height > -1000.f) {
				height_sum += height;
				height_count++;
			}
		}
	}
	JSIOBuffer[0] = height_count != 0
		? height_sum / height_count
		: -16384.f;
}

WASM_EXPORT(GetCursorRay) void GetCursorRay() {
	auto window_size = UnwrapVector2();
	auto camera_angles = UnwrapVector3(2);
	auto fov = JSIOBuffer[5];
	auto screen = UnwrapVector2(6);
	
	Vector vForward, vRight, vUp;
	CameraAngleVectors(*(QAngle*)&camera_angles, &vForward, &vRight, &vUp);
	FixWindowSize(window_size);
	if (fov <= 0.f)
		fov = GetFOVForWindowSize(window_size);
	auto far_size = GetFarSize(window_size, fov);
	screen.x = screen.x * 2.f - 1.f;
	screen.y = 1.f - screen.y * 2.f;
	auto res = vForward + vRight * (far_size.x * screen.x) + vUp * (far_size.y * screen.y);
	memcpy(JSIOBuffer, &res, sizeof(res));
}

WASM_EXPORT(ScreenToWorldFar) void ScreenToWorldFar() {
	auto window_size = UnwrapVector2();
	auto camera_position = UnwrapVector3(2);
	auto camera_angles = UnwrapVector3(5);
	auto camera_distance = JSIOBuffer[8];
	auto fov = JSIOBuffer[9];
	auto flags = *(uint32_t*)&JSIOBuffer[10];
	auto screens_count = (uint16_t)JSIOBuffer[11];
	
	Vector vForward, vRight, vUp;
	CameraAngleVectors(*(QAngle*)&camera_angles, &vForward, &vRight, &vUp);
	FixWindowSize(window_size);
	if (fov <= 0.f)
		fov = GetFOVForWindowSize(window_size);
	auto far_size = GetFarSize(window_size, fov);

	auto screens_results = new Vector[screens_count];
	bool initialized = RayTraceInitialized();
	for (int i = 0; i < screens_count; i++) {
		auto screen = UnwrapVector2(12 + i * 2);
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
			auto res = TryRayTrace(camera_position, ray, flags);
			if (res)
				cur_pos = res->pos;
			else
				cur_pos.Invalidate();
		}
	}
	memcpy(JSIOBuffer, screens_results, screens_count * sizeof(*screens_results));
	delete[] screens_results;
}

WASM_EXPORT(malloc) void* my_malloc(size_t data_size) {
	return malloc(data_size);
}

WASM_EXPORT(free) void my_free(void* ptr) {
	return free(ptr);
}

// https://github.com/ValveSoftware/source-sdk-2013/blob/0d8dceea4310fde5706b3ce1c70609d72a38efdf/sp/src/tier1/generichash.cpp#L313
// someone please port it to JS >_<
WASM_EXPORT(MurmurHash2) uint32_t MurmurHash2(void* key, int len, uint32_t seed) {
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
WASM_EXPORT(MurmurHash64) void MurmurHash64(void* key, int len, uint32_t seed) {
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

WASM_EXPORT(CRC32) uint32_t CRC32(void* data, int len) {
	auto ret = crc32((const char*)data, (size_t)len);
	free(data);
	return ret;
}

VMatrix SavedWorldToProjection;
WASM_EXPORT(CloneWorldToProjection) void CloneWorldToProjection() {
	memcpy(SavedWorldToProjection.m, JSIOBuffer, sizeof(SavedWorldToProjection.m));
}
WASM_EXPORT(WorldToScreenNew) bool WorldToScreenNew() {
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

WASM_EXPORT(DecompressVertexBuffer) void* DecompressVertexBuffer(
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

WASM_EXPORT(DecompressIndexBuffer) void* DecompressIndexBuffer(
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
WASM_EXPORT(ResetWorld) void ResetWorld() {
	ResetWorldInternal();
}

extern void LoadWorldMeshInternal(
	uint32_t id,
	std::string_view vertex_data, size_t vertex_elem_size,
	std::string_view index_data, size_t index_elem_size,
	uint32_t flags,
	uint32_t path_id
);
WASM_EXPORT(LoadWorldMesh) void LoadWorldMesh(
	uint32_t id,
	void* vertex_ptr, size_t vertex_size, size_t vertex_elem_size,
	void* index_ptr, size_t index_size, size_t index_elem_size,
	uint32_t flags,
	uint32_t path_id
) {
	LoadWorldMeshInternal(
		id,
		{ (const char*)vertex_ptr, vertex_size }, vertex_elem_size,
		{ (const char*)index_ptr, index_size }, index_elem_size,
		flags,
		path_id
	);
	free(vertex_ptr);
	free(index_ptr);
}

extern void LoadWorldMeshCachedInternal(
	uint32_t id,
	std::string_view triangles_data,
	std::string_view cached_nodes,
	std::string_view cached_indices,
	uint32_t flags,
	uint32_t path_id
);
WASM_EXPORT(LoadWorldMeshCached) void LoadWorldMeshCached(
	uint32_t id,
	void* triangles_ptr, size_t triangles_size,
	void* nodes_ptr, size_t nodes_size,
	void* indices_ptr, size_t indices_size,
	uint32_t flags,
	uint32_t path_id
) {
	LoadWorldMeshCachedInternal(
		id,
		{ (const char*)triangles_ptr, triangles_size },
		{ (const char*)nodes_ptr, nodes_size },
		{ (const char*)indices_ptr, indices_size },
		flags,
		path_id
	);
	free(triangles_ptr);
	free(nodes_ptr);
	free(indices_ptr);
}

extern void SpawnWorldMeshInternal(uint32_t id, const VMatrix& transform);
WASM_EXPORT(SpawnWorldMesh) void SpawnWorldMesh(uint32_t id) {
	SpawnWorldMeshInternal(id, *(const VMatrix*)JSIOBuffer);
}

extern void FinishWorldInternal(std::string_view cached_nodes, std::string_view cached_indices);
WASM_EXPORT(FinishWorld) void FinishWorld(
	void* nodes_ptr, size_t nodes_size,
	void* indices_ptr, size_t indices_size
) {
	FinishWorldInternal(
		{ (const char*)nodes_ptr, nodes_size },
		{ (const char*)indices_ptr, indices_size }
	);
	free(nodes_ptr);
	free(indices_ptr);
}

extern std::pair<std::string_view, std::string_view> ExtractWorldBVHInternal();
WASM_EXPORT(ExtractWorldBVH) void ExtractWorldBVH() {
	static_assert(sizeof(uint32_t) == sizeof(void*));
	auto [cached_nodes, cached_indices] = ExtractWorldBVHInternal();
	*(uint32_t*)&JSIOBuffer[0] = (uint32_t)cached_nodes.data();
	*(uint32_t*)&JSIOBuffer[1] = (uint32_t)cached_nodes.size();
	*(uint32_t*)&JSIOBuffer[2] = (uint32_t)cached_indices.data();
	*(uint32_t*)&JSIOBuffer[3] = (uint32_t)cached_indices.size();
}

extern MeshData ExtractMeshDataInternal(uint32_t id);
WASM_EXPORT(ExtractMeshData) void ExtractMeshData(uint32_t id) {
	static_assert(sizeof(uint32_t) == sizeof(void*));
	auto data = ExtractMeshDataInternal(id);
	*(uint32_t*)&JSIOBuffer[0] = (uint32_t)data.triangles.data();
	*(uint32_t*)&JSIOBuffer[1] = (uint32_t)data.triangles.size();
	*(uint32_t*)&JSIOBuffer[2] = (uint32_t)data.cached_nodes.data();
	*(uint32_t*)&JSIOBuffer[3] = (uint32_t)data.cached_nodes.size();
	*(uint32_t*)&JSIOBuffer[4] = (uint32_t)data.cached_indices.data();
	*(uint32_t*)&JSIOBuffer[5] = (uint32_t)data.cached_indices.size();
	*(uint32_t*)&JSIOBuffer[6] = data.flags;
	*(uint32_t*)&JSIOBuffer[7] = data.path_id;
}

inline bool IntersectRayAABB(
	float min_t, float max_t,
	const float* bmin, const float* bmax,
	const float* ray_org,
	const float* ray_inv_dir,
	bool ray_dir_sign[3]
) {
	const float min_x = ray_dir_sign[0] ? bmax[0] : bmin[0];
	const float min_y = ray_dir_sign[1] ? bmax[1] : bmin[1];
	const float min_z = ray_dir_sign[2] ? bmax[2] : bmin[2];
	const float max_x = ray_dir_sign[0] ? bmin[0] : bmax[0];
	const float max_y = ray_dir_sign[1] ? bmin[1] : bmax[1];
	const float max_z = ray_dir_sign[2] ? bmin[2] : bmax[2];

	// X
	const float tmin_x = (min_x - ray_org[0]) * ray_inv_dir[0];
	// MaxMult robust BVH traversal(up to 4 ulp).
	// 1.0000000000000004 for double precision.
	const float tmax_x = (max_x - ray_org[0]) * ray_inv_dir[0] * 1.00000024f;

	// Y
	const float tmin_y = (min_y - ray_org[1]) * ray_inv_dir[1];
	const float tmax_y = (max_y - ray_org[1]) * ray_inv_dir[1] * 1.00000024f;

	// Z
	const float tmin_z = (min_z - ray_org[2]) * ray_inv_dir[2];
	const float tmax_z = (max_z - ray_org[2]) * ray_inv_dir[2] * 1.00000024f;

	const float tmin = std::max(tmin_z, std::max(tmin_y, std::max(tmin_x, min_t)));
	const float tmax = std::min(tmax_z, std::min(tmax_y, std::min(tmax_x, max_t)));
	return tmin <= tmax;
}

WASM_EXPORT(BatchCheckRayBox) void BatchCheckRayBox() {
	auto ray_org = &JSIOBuffer[0];
	auto ray_dir = &JSIOBuffer[3];

	float ray_inv_dir[3]{
		1.f / ray_dir[0],
		1.f / ray_dir[1],
		1.f / ray_dir[2]
	};
	bool dir_sign[3]{
		ray_inv_dir[0] < 0.f,
		ray_inv_dir[1] < 0.f,
		ray_inv_dir[2] < 0.f
	};

	auto count = (uint16_t)JSIOBuffer[6];
	for (int i = 0; i < count; i++) {
		auto bmin = &JSIOBuffer[7 + i * 3 * 2 + 0];
		auto bmax = &JSIOBuffer[7 + i * 3 * 2 + 3];
		constexpr float ray_min = 0.f, ray_max = 1.0e+30f;
		*GetPointer<bool>(JSIOBuffer, i) = IntersectRayAABB(
			ray_min,
			ray_max,
			bmin,
			bmax,
			ray_org,
			ray_inv_dir,
			dir_sign
		);
	}
}

int main() {
	return 0;
}
