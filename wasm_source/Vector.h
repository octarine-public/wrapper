#pragma once
#include "stdafx.h"

class Vector2D;
class Vector;

using vec_t = float;

class Vector {
public:
	// Members
	vec_t x, y, z;

	// Construction/destruction:
	FORCEINLINE Vector() {
		x = y = z = 0;
	}

	FORCEINLINE Vector(vec_t x, vec_t y, vec_t z) {
		this->x = x;
		this->y = y;
		this->z = z;
	}

	// Initialization
	FORCEINLINE void Init(vec_t x, vec_t y, vec_t z) {
		this->x = x;
		this->y = y;
		this->z = z;
	}
	FORCEINLINE void Init(vec_t i = 0.f) {
		x = y = z = i;
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
		x = y = z = 0;
	}

	// equality
	bool operator==(const Vector& v) {
		return (v.x == x) && (v.y == y) && (v.z == z);
	}
	bool operator!=(const Vector& v) {
		return (v.x != x) || (v.y != y) || (v.z != z);
	}

	// arithmetic operations
	FORCEINLINE Vector operator+=(const Vector& v) {
		x += v.x;
		y += v.y;
		z += v.z;
		return *this;
	}
	FORCEINLINE Vector operator-=(const Vector& v) {
		x -= v.x;
		y -= v.y;
		z -= v.z;
		return *this;
	}
	FORCEINLINE Vector operator*=(const Vector& v) {
		x *= v.x;
		y *= v.y;
		z *= v.z;
		return *this;
	}
	FORCEINLINE Vector operator/=(const Vector& v) {
		x /= v.x;
		y /= v.y;
		z /= v.z;
		return *this;
	}

	FORCEINLINE Vector operator*=(vec_t fl) {
		x *= fl;
		y *= fl;
		z *= fl;
		return *this;
	}
	FORCEINLINE Vector operator/=(vec_t fl) {
		x /= fl;
		y /= fl;
		z /= fl;
		return *this;
	}
	FORCEINLINE Vector operator+=(vec_t fl) { ///< broadcast add
		x += fl;
		y += fl;
		z += fl;
		return *this;
	}
	FORCEINLINE Vector operator-=(vec_t fl) { ///< broadcast sub
		x -= fl;
		y -= fl;
		z -= fl;
		return *this;
	}

	FORCEINLINE Vector operator+(const Vector& v) const {
		return Vector(x + v.x, y + v.y, z + v.z);
	}
	FORCEINLINE Vector operator-(const Vector& v) const {
		return Vector(x - v.x, y - v.y, z - v.z);
	}
	FORCEINLINE Vector operator*(const Vector& v) const {
		return Vector(x * v.x, y * v.y, z * v.z);
	}
	FORCEINLINE Vector operator*(const vec_t fl) const {
		return Vector(x * fl, y * fl, z * fl);
	}
	FORCEINLINE Vector operator/(const vec_t fl) const {
		return Vector(x / fl, y / fl, z / fl);
	}

	// negate the vector components
	FORCEINLINE void Negate() {
		x = -x;
		y = -y;
		z = -z;
	}

	// Get the vector's magnitude.
	FORCEINLINE vec_t Length() {
		auto len_sqr = LengthSqr();
		if (len_sqr == 0.f)
			return 0.f;
		return sqrt(len_sqr);
	}

	// Get the vector's magnitude squared.
	FORCEINLINE vec_t LengthSqr() {
		return x * x + y * y + z * z;
	}

	// Get one over the vector's length
	// via fast hardware approximation
	FORCEINLINE vec_t LengthRecipFast() {
		return 1.f / sqrt(LengthSqr());
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
			y /= len;
			z /= len;
		}

		return len;
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
		ar[1] = y;
		ar[2] = z;
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
		this->x = vOther.x;
		this->y = vOther.y;
		this->z = vOther.z;
		return *this;
	}

	// 2d
	FORCEINLINE vec_t Length2DSqr() const {
		return this->x * this->x + this->y * this->y;
	}

	FORCEINLINE vec_t Length2D() const {
		return (vec_t)sqrt(Length2DSqr());
	}

	// Returns the squared distance between the this and another vector
	FORCEINLINE vec_t DistanceSqr(const Vector& vOther) const {
		Vector delta;

		delta.x = this->x - vOther.x;
		delta.y = this->y - vOther.y;
		delta.z = this->z - vOther.z;

		return delta.LengthSqr();
	}

	// Returns the distance between the this and another vector
	FORCEINLINE vec_t Distance(const Vector& vOther) const {
		return sqrt(this->DistanceSqr(vOther));
	}

	// get the component of this vector parallel to some other given vector
	FORCEINLINE void CopyTo(Vector& onto) const {
		onto.x = this->x;
		onto.y = this->y;
		onto.z = this->z;
	}

	FORCEINLINE Vector operator-() const {
		return Vector(-x, -y, -z);
	}
};

FORCEINLINE Vector operator*(float lhs, const Vector& rhs) {
	return rhs * lhs;
}
FORCEINLINE Vector operator/(float lhs, const Vector& rhs) {
	return rhs / lhs;
}

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
		return sqrt(pitch * pitch + yaw * yaw + roll * roll);
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

FORCEINLINE QAngle operator*(float lhs, const QAngle& rhs) {
	return rhs * lhs;
}
FORCEINLINE QAngle operator/(float lhs, const QAngle& rhs) {
	return rhs / lhs;
}

class Vector2D {
public:
	// Members
	vec_t x, y;

	FORCEINLINE Vector2D() {
		x = y = 0;
	}

	FORCEINLINE Vector2D(vec_t x, vec_t y) {
		this->x = x;
		this->y = y;
	}

	// array access...
	FORCEINLINE vec_t& operator[](int i) const {
		// static_assert((i >= 0) || (i <= 2));
		return ((vec_t*)this)[i];
	}

	FORCEINLINE Vector2D operator-(const Vector2D& v) {
		return Vector2D(x - v.x, y - v.y);
	}

	FORCEINLINE Vector2D& operator=(const Vector2D& vOther) {
		this->x = vOther.x;
		this->y = vOther.y;
		return *this;
	}
	FORCEINLINE Vector2D operator/=(const Vector2D& v) {
		x /= v.x;
		y /= v.y;
		return *this;
	}
	FORCEINLINE Vector2D operator+=(const Vector2D& v) {
		x += v.x;
		y += v.y;
		return *this;
	}
	FORCEINLINE Vector2D operator/=(vec_t fl) {
		x /= fl;
		y /= fl;
		return *this;
	}
	FORCEINLINE Vector2D operator*=(vec_t fl) {
		x *= fl;
		y *= fl;
		return *this;
	}
	FORCEINLINE Vector2D operator+=(vec_t fl) {
		x += fl;
		y += fl;
		return *this;
	}
	FORCEINLINE Vector2D operator*(const vec_t fl) const {
		return Vector2D(x * fl, y * fl);
	}
	FORCEINLINE Vector2D operator/(const vec_t fl) const {
		return Vector2D(x / fl, y / fl);
	}
	FORCEINLINE Vector2D operator+(const Vector2D& v) const {
		return Vector2D(x + v.x, y + v.y);
	}

	FORCEINLINE void Zero() {
		x = y = 0;
	}

	// Get the vector's magnitude.
	FORCEINLINE vec_t Length() {
		auto len_sqr = LengthSqr();
		if (len_sqr == 0.f)
			return 0.f;
		return sqrt(len_sqr);
	}

	// Get the vector's magnitude squared.
	FORCEINLINE vec_t LengthSqr() {
		return x * x + y * y;
	}

	// Get the distance from this vector to the other one.
	FORCEINLINE vec_t DistTo(const Vector2D& vOther) {
		return (*this - vOther).Length();
	}

	FORCEINLINE void Invalidate() {
		x = y = NAN;
	}

	FORCEINLINE void CopyTo(Vector2D& onto) {
		onto.x = this->x;
		onto.y = this->y;
	}
	FORCEINLINE void CopyTo(float* ar) {
		ar[0] = this->x;
		ar[1] = this->y;
	}

	FORCEINLINE Vector2D Floor() {
		return Vector2D(floorf(this->x), floorf(this->y));
	}
	FORCEINLINE Vector2D& FloorForThis() {
		this->x = floorf(this->x);
		this->y = floorf(this->y);
		return *this;
	}
	FORCEINLINE Vector2D Min(float num) {
		return Vector2D(fmin(this->x, num), fmin(this->x, num));
	}
	FORCEINLINE Vector2D Max(float num) {
		return Vector2D(fmax(this->x, num), fmax(this->x, num));
	}

	// Base address...
	FORCEINLINE vec_t* Base() { return (vec_t*)this; }

	FORCEINLINE Vector TransformToVector() { return Vector(x, y, 0); }
};

FORCEINLINE Vector2D operator*(float lhs, const Vector2D& rhs) {
	return rhs * lhs;
}
FORCEINLINE Vector2D operator/(float lhs, const Vector2D& rhs) {
	return rhs / lhs;
}
