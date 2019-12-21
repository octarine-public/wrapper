#pragma once
#include "stdafx.h"

class Vector2D;
class Vector;

using vec_t = float;

FORCEINLINE float FastSqrt(float x) {
	return sqrt(x);
}

FORCEINLINE float FastRSqrt(float x) {
	return 1.f/sqrt(x);
}

class Vector {
public:
	// Members
	vec_t x, z, y;

	// Construction/destruction:
	FORCEINLINE Vector() {
		x = z = y = 0;
	}

	FORCEINLINE Vector(vec_t x, vec_t z, vec_t y) {
		this->x = x;
		this->z = z;
		this->y = y;
	}

	// Initialization
	FORCEINLINE void Init(vec_t x, vec_t y, vec_t z) {
		this->x = x;
		this->z = z;
		this->y = y;
	}
	FORCEINLINE void Init(vec_t i = 0.f) {
		x = z = y = i;
	}

	FORCEINLINE void Invalidate() {
		x = y = z = NAN;
	}


	// array access...
	FORCEINLINE vec_t& operator[](int i) const {
		// static_assert((i >= 0) || (i <= 2));
		return ((vec_t*)this)[i];
	}

	// Base address...
	FORCEINLINE vec_t* Base() {
		return (vec_t*)this;
	}

	// Cast to Vector2D...
	FORCEINLINE Vector2D& AsVector2D() const {
		return *(Vector2D*)this;
	}

	// Zero out a vector
	FORCEINLINE void Zero() {
		x = z = y = 0;
	}

	// equality
	bool operator==(const Vector& v) {
		return (v.x == x) && (v.z == z) && (v.y == y);
	}
	bool operator!=(const Vector& v) {
		return (v.x != x) || (v.z != z) || (v.y != y);
	}

	// arithmetic operations
	FORCEINLINE Vector operator+=(const Vector& v) {
		x += v.x;
		z += v.z;
		y += v.y;
		return *this;
	}
	FORCEINLINE Vector operator-=(const Vector& v) {
		x -= v.x;
		z -= v.z;
		y -= v.y;
		return *this;
	}
	FORCEINLINE Vector operator*=(const Vector& v) {
		x *= v.x;
		z *= v.z;
		y *= v.y;
		return *this;
	}
	FORCEINLINE Vector operator/=(const Vector& v) {
		x /= v.x;
		z /= v.z;
		y /= v.y;
		return *this;
	}

	FORCEINLINE Vector operator*=(vec_t fl) {
		x *= fl;
		z *= fl;
		y *= fl;
		return *this;
	}
	FORCEINLINE Vector operator/=(vec_t fl) {
		x /= fl;
		z /= fl;
		y /= fl;
		return *this;
	}
	FORCEINLINE Vector operator+=(vec_t fl) { ///< broadcast add
		x += fl;
		z += fl;
		y += fl;
		return *this;
	}
	FORCEINLINE Vector operator-=(vec_t fl) { ///< broadcast sub
		x -= fl;
		z -= fl;
		y -= fl;
		return *this;
	}

	FORCEINLINE Vector operator+(const Vector& v) {
		return Vector(x + v.x, z + v.z, y + v.y);
	}
	FORCEINLINE Vector operator-(const Vector& v) {
		return Vector(x - v.x, z - v.z, y - v.y);
	}
	FORCEINLINE Vector operator*(const Vector& v) {
		return Vector(x * v.x, z * v.z, y * v.y);
	}
	FORCEINLINE Vector operator*(const vec_t fl) {
		return Vector(x * fl, z * fl, y * fl);
	}

	// negate the vector components
	FORCEINLINE void Negate() {
		x = -x;
		z = -z;
		y = -y;
	}

	// Get the vector's magnitude.
	FORCEINLINE vec_t Length() {
		auto len_sqr = LengthSqr();
		if (len_sqr == 0.f)
			return 0.f;
		return FastSqrt(len_sqr);
	}

	// Get the vector's magnitude squared.
	FORCEINLINE vec_t LengthSqr() {
		return x * x + z * z + y * y;
	}

	// Get one over the vector's length
	// via fast hardware approximation
	FORCEINLINE vec_t LengthRecipFast() {
		return FastRSqrt(LengthSqr());
	}

	// return true if this vector is (0,0,0) within tolerance
	bool IsZero(float tolerance = 0.01f) {
		return (x > -tolerance && x < tolerance &&
			y > -tolerance && y < tolerance &&
			z > -tolerance && z < tolerance);
	}

	vec_t NormalizeInPlace() {
		vec_t len = Length();

		if (len != 0) {
			x /= len;
			z /= len;
			y /= len;
		}

		return len;
	}
	FORCEINLINE bool IsLengthGreaterThan(float val) {
		return LengthSqr() > val* val;
	}
	FORCEINLINE bool IsLengthLessThan(float val) {
		return LengthSqr() < val * val;
	}

	// check if a vector is within the box defined by two other vectors
	bool WithinAABox(const Vector& boxmin, const Vector& boxmax) {
		return (
			(x >= boxmin.x) && (x <= boxmax.x) &&
			(y >= boxmin.y) && (y <= boxmax.y) &&
			(z >= boxmin.z) && (z <= boxmax.z)
			);
	}

	// Get the distance from this vector to the other one.
	FORCEINLINE vec_t DistTo(const Vector& vOther) {
		return (*this - vOther).Length();
	}
	FORCEINLINE vec_t DistTo2D(const Vector& vOther) {
		return (*this - vOther).Length2D();
	}

	// Get the distance from this vector to the other one squared.
	// NJS: note, VC wasn't inlining it correctly in several deeply nested inlines due to being an 'out of line' inline.  
	// may be able to tidy this up after switching to VC7
	FORCEINLINE vec_t DistToSqr(const Vector& vOther) {
		return (*this - vOther).LengthSqr();
	}

	// Copy
	FORCEINLINE void CopyTo(float* ar) {
		ar[0] = x;
		ar[1] = z;
		ar[2] = y;
	}

	// Multiply, add, and assign to this (ie: *this = a + b * scalar). This
	// is about 12% faster than the actual vector equation (because it's done per-component
	// rather than per-vector).
	void MulAdd(Vector& a, Vector& b, float scalar) {
		*this = (a + b) * scalar;
	}

	// Dot product.
	FORCEINLINE vec_t Dot(const Vector& vOther) {
		return this->x * vOther.x + this->y * vOther.y + this->z * vOther.z;
	}

	// assignment
	FORCEINLINE Vector& operator=(const Vector& vOther) {
		x = vOther.x;
		z = vOther.z;
		y = vOther.y;
		return *this;
	}

	// returns 0, 1, 2 corresponding to the component with the largest absolute value
	int LargestComponent() {
		if (x > z)
			if (x > y)
				return 0;
			else
				return 2;
		else
			if (z > y)
				return 1;
			else
				return 2;
	}

	// 2d
	FORCEINLINE vec_t Length2DSqr() {
		return x * x + z * z;
	}

	FORCEINLINE vec_t Length2D() {
		return (vec_t)FastSqrt(Length2DSqr());
	}

	// get the component of this vector parallel to some other given vector
	FORCEINLINE void CopyTo(Vector& onto) {
		onto.x = x;
		onto.z = z;
		onto.y = y;
	}

	// Cross product between two vectors.
	Vector Cross(const Vector& vOther) {
		return Vector (
			this->y * vOther.z - this->z * vOther.y,
			this->z * vOther.x - this->x * vOther.z,
			this->x * vOther.y - this->y * vOther.x
		);
	}

	// Returns a vector with the min or max in X, Y, and Z.
	FORCEINLINE Vector Min(const Vector& vOther) {
		return Vector(fmin(x, vOther.x), fmin(z, vOther.z), fmin(y, vOther.z));
	}
	FORCEINLINE Vector Max(const Vector& vOther) {
		return Vector(fmax(x, vOther.x), fmax(z, vOther.z), fmax(y, vOther.z));
	}
	FORCEINLINE Vector operator-() const {
		return Vector(-x, -z, -y);
	}
};

class QAngle {
public:
	FORCEINLINE QAngle(void) {
		Init();
	}
	FORCEINLINE QAngle(float X, float Y, float Z) {
		Init(X, Y, Z);
	}
	FORCEINLINE QAngle(const float* clr) {
		Init(clr[0], clr[1], clr[2]);
	}

	FORCEINLINE void Init(float ix = 0.0f, float iy = 0.0f, float iz = 0.0f) {
		pitch = ix;
		yaw = iy;
		roll = iz;
	}

	FORCEINLINE void CopyTo(float* ar) {
		ar[0] = this->pitch;
		ar[1] = this->yaw;
		ar[2] = this->roll;
	}

	FORCEINLINE float operator[](int i) const {
		return ((float*)this)[i];
	}
	FORCEINLINE float& operator[](int i) {
		return ((float*)this)[i];
	}
	QAngle& operator=(const Vector& v) {
		(*this)[0] = v[0];
		(*this)[1] = v[1];
		(*this)[2] = v[2];
		return *this;
	}
	QAngle& operator+=(const QAngle& v) {
		pitch += v.pitch; yaw += v.yaw; roll += v.roll;
		return *this;
	}
	QAngle& operator-=(const QAngle& v) {
		pitch -= v.pitch; yaw -= v.yaw; roll -= v.roll;
		return *this;
	}
	QAngle& operator*=(float fl) {
		pitch *= fl;
		yaw *= fl;
		roll *= fl;
		return *this;
	}
	QAngle& operator*=(const QAngle& v) {
		pitch *= v.pitch;
		yaw *= v.yaw;
		roll *= v.roll;
		return *this;
	}
	QAngle& operator/=(const QAngle& v) {
		pitch /= v.pitch;
		yaw /= v.yaw;
		roll /= v.roll;
		return *this;
	}
	QAngle& operator+=(float fl) {
		pitch += fl;
		yaw += fl;
		roll += fl;
		return *this;
	}
	QAngle& operator/=(float fl) {
		pitch /= fl;
		yaw /= fl;
		roll /= fl;
		return *this;
	}
	QAngle& operator-=(float fl) {
		pitch -= fl;
		yaw -= fl;
		roll -= fl;
		return *this;
	}
	QAngle& operator=(const QAngle& vOther) {
		pitch = vOther.pitch; yaw = vOther.yaw; roll = vOther.roll;
		return *this;
	}
	QAngle operator-(void) const {
		return QAngle(-pitch, -yaw, -roll);
	}
	QAngle operator+(const QAngle& v) const {
		return QAngle(pitch + v.pitch, yaw + v.yaw, roll + v.roll);
	}
	QAngle operator-(const QAngle& v) const {
		return QAngle(pitch - v.pitch, yaw - v.yaw, roll - v.roll);
	}
	QAngle operator*(float fl) const {
		return QAngle(pitch * fl, yaw * fl, roll * fl);
	}
	QAngle operator*(const QAngle& v) const {
		return QAngle(pitch * v.pitch, yaw * v.yaw, roll * v.roll);
	}
	QAngle operator/(float fl) const {
		return QAngle(pitch / fl, yaw / fl, roll / fl);
	}
	QAngle operator/(const QAngle& v) const {
		return QAngle(pitch / v.pitch, yaw / v.yaw, roll / v.roll);
	}

	float Length() const {
		return FastSqrt(pitch * pitch + yaw * yaw + roll * roll);
	}
	float LengthSqr() const {
		return (pitch * pitch + yaw * yaw + roll * roll);
	}
	bool IsZero(float tolerance = 0.01f) const {
		return (pitch > -tolerance && pitch < tolerance &&
			yaw > -tolerance && yaw < tolerance &&
			roll > -tolerance && roll < tolerance);
	}

	float pitch;
	float yaw;
	float roll;
};

inline QAngle operator*(float lhs, const QAngle& rhs) {
	return rhs * lhs;
}
inline QAngle operator/(float lhs, const QAngle& rhs) {
	return rhs / lhs;
}

class Vector2D {
public:
	// Members
	vec_t x, z;

	FORCEINLINE Vector2D() {
		x = z = 0;
	}

	FORCEINLINE Vector2D(vec_t x, vec_t z) {
		this->x = x;
		this->z = z;
	}

	// array access...
	FORCEINLINE vec_t& operator[](int i) const {
		// static_assert((i >= 0) || (i <= 2));
		return ((vec_t*)this)[i];
	}

	FORCEINLINE Vector2D operator-(const Vector2D& v) {
		return Vector2D(x - v.x, z - v.z);
	}

	FORCEINLINE Vector2D& operator=(const Vector2D& vOther) {
		this->x = vOther.x;
		this->z = vOther.z;
		return *this;
	}
	FORCEINLINE Vector2D operator/=(const Vector2D& v) {
		x /= v.x;
		z /= v.z;
		return *this;
	}
	FORCEINLINE Vector2D operator+=(const Vector2D& v) {
		x += v.x;
		z += v.z;
		return *this;
	}
	FORCEINLINE Vector2D operator/=(vec_t fl) {
		x /= fl;
		z /= fl;
		return *this;
	}
	FORCEINLINE Vector2D operator*=(vec_t fl) {
		x *= fl;
		z *= fl;
		return *this;
	}
	FORCEINLINE Vector2D operator+=(vec_t fl) {
		x += fl;
		z += fl;
		return *this;
	}
	FORCEINLINE Vector2D operator*(const vec_t fl) {
		return Vector2D(x * fl, z * fl);
	}
	FORCEINLINE Vector2D operator/(const vec_t fl) {
		return Vector2D(x / fl, z / fl);
	}
	FORCEINLINE Vector2D operator+(const Vector2D& v) {
		return Vector2D(x + v.x, z + v.z);
	}

	FORCEINLINE void Zero() {
		x = z = 0;
	}

	// Get the vector's magnitude.
	FORCEINLINE vec_t Length() {
		auto len_sqr = LengthSqr();
		if (len_sqr == 0.f)
			return 0.f;
		return FastSqrt(len_sqr);
	}

	// Get the vector's magnitude squared.
	FORCEINLINE vec_t LengthSqr() {
		return x * x + z * z;
	}

	// Get the distance from this vector to the other one.
	FORCEINLINE vec_t DistTo(const Vector2D& vOther) {
		return (*this - vOther).Length();
	}

	FORCEINLINE void Invalidate() {
		x = z = NAN;
	}

	FORCEINLINE void CopyTo(Vector2D& onto) {
		onto.x = this->x;
		onto.z = this->z;
	}
	FORCEINLINE void CopyTo(float* ar) {
		ar[0] = this->x;
		ar[1] = this->z;
	}

	Vector2D VectorRotation(const Vector2D& rotation, float dist) {
		return
#ifdef __FMA__
			Vector2D(fma(rotation.x, dist, x), fma(rotation.z, dist, z));
#else
			Vector2D(rotation.x * dist + x, rotation.z * dist + z);
#endif
	}

	FORCEINLINE float AngleBetweenTwoVectors(const Vector2D& vec) {
		return atan2(vec.z - z, vec.x - x); // TODO: implement intrinsics there
	}

	// Base address...
	FORCEINLINE vec_t* Base() { return (vec_t*)this; }

	FORCEINLINE Vector TransformToVector() { return Vector(x, z, 0); }
};
