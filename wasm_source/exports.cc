#include "stdafx.h"

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
	float halfAngleRadians = fovDegrees * ( 0.5f * M_PI / 180.0f );
	float t = tan( halfAngleRadians );
	t *= ratio;
	float retDegrees = ( 180.0f / M_PI ) * atan( t );
	return retDegrees * 2.0f;
}

FORCEINLINE int GetOtherMagic(Vector2D window_size, int input) {
	return floor((double)window_size.z / (double)0x300 * (double)input);
}

FORCEINLINE float GetScreenMagicRatio(Vector2D window_size) {
	if (window_size.x == 1280.f && window_size.z == 1024.f)
		window_size.z = 960.f;
	return ScaleFOVByWidthRatio(67.f, window_size.x / (window_size.z - (GetOtherMagic(window_size, 117) + GetOtherMagic(window_size, 31))) * 0.75f) /*(like division by 4:3)*/;
}

void ComputeViewMatrices(VMatrix* pWorldToView, VMatrix* pViewToProjection, VMatrix* pWorldToProjection, Vector& camera_pos, QAngle& camera_angles, Vector2D& window_size, double camera_distance) {
	ComputeViewMatrix(pWorldToView, camera_pos /* viewSetup.origin */, camera_angles /* viewSetup.angles */);
	// https://stackoverflow.com/a/2831560880.07724875735302
	float window_ratio = window_size.x / window_size.z;
	MatrixBuildPerspectiveX(*pViewToProjection, GetScreenMagicRatio(window_size), window_ratio, 7. /* viewSetup.zNear magic */, camera_distance * 2.);
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
		screen.z = 0.5f - screen.z / 2.f;
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
FORCEINLINE Vector UnwrapVector3(int offset = 0) {
	return *(Vector*)&JSIOBuffer[offset];
}

EXPORT_JS float* GetIOBuffer() {
	return &JSIOBuffer[0];
}

VMatrix worldToProjection;
void CacheFrame() {
	auto camera_pos = UnwrapVector3();
	auto camera_ang = UnwrapVector3(3);
	auto camera_dist = JSIOBuffer[6];
	auto window_size = Vector2D(JSIOBuffer[7], JSIOBuffer[8]);
	GetWorldToProjection(worldToProjection, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
}

EXPORT_JS bool WorldToScreenCached() {
	auto world_vec = UnwrapVector3();
	Vector2D screen_vec;
	if (ScreenTransform(world_vec, screen_vec, worldToProjection)) {
		JSIOBuffer[0] = screen_vec.x;
		JSIOBuffer[1] = screen_vec.z;
		return true;
	} else
		return false;
}

EXPORT_JS void ScreenToWorldCached() {
	auto screen = Vector2D(JSIOBuffer[0], JSIOBuffer[1]);
	VMatrix projectionToWorld;
	MatrixInverseGeneral(worldToProjection, projectionToWorld);
	Vector point;
	WorldTransform(screen, point, projectionToWorld);
	
	JSIOBuffer[0] = point.x;
	JSIOBuffer[1] = point.z;
	JSIOBuffer[2] = point.y;
}

EXPORT_JS bool WorldToScreen() {
	auto world_vec = UnwrapVector3();
	auto camera_pos = UnwrapVector3(3);
	auto camera_ang = UnwrapVector3(6);
	auto camera_dist = JSIOBuffer[9];
	auto window_size = Vector2D(JSIOBuffer[10], JSIOBuffer[11]);
	VMatrix worldToProjection;
	GetWorldToProjection(worldToProjection, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
	Vector2D screen_vec;
	if (ScreenTransform(world_vec, screen_vec, worldToProjection)) {
		JSIOBuffer[0] = screen_vec.x;
		JSIOBuffer[1] = screen_vec.z;
		return true;
	} else
		return false;
}

EXPORT_JS void ScreenToWorld() {
	auto screen = Vector2D(JSIOBuffer[0], JSIOBuffer[1]);
	auto camera_pos = UnwrapVector3(2);
	auto camera_ang = UnwrapVector3(5);
	auto camera_dist = JSIOBuffer[8];
	auto window_size = Vector2D(JSIOBuffer[9], JSIOBuffer[10]);
	VMatrix projectionToWorld;
	GetWorldToProjection(projectionToWorld, camera_pos, *(QAngle*)&camera_ang, window_size, camera_dist);
	MatrixInverseGeneral(projectionToWorld, projectionToWorld);
	Vector point;
	WorldTransform(screen, point, projectionToWorld);
	
	JSIOBuffer[0] = point.x;
	JSIOBuffer[1] = point.z;
	JSIOBuffer[2] = point.y;
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
	JSIOBuffer[0] = w;
	JSIOBuffer[1] = h;
	free(data);
	return res;
}
