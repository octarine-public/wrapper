global.EventEmitter = class EventEmitter {
  events = {};

  on(name, listener) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      this.events[name] = listeners = [];
    }

    listeners.push(listener);
    return this;
  }

  removeListener(name, listener) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      return;
    }

    const idx = listeners.indexOf(listener);

    if (idx > -1) {
      listeners.splice(idx, 1);
    }

    return this;
  }

  removeAllListeners() {
    let _a = Object.keys(this.events);

    let _f = name => {
      return this.events[name].splice(0);
    };

    for (let _i = _a.length; _i--;) {
      _f(_a[_i], _i, _a);
    }

    return this;
  }

  emit(name, cancellable, ...args) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      return true;
    }

    return !listeners.some(listener => {
      return listener.apply(this, args) === false && cancellable;
    });
  }

  once(name, listener) {
    const once_listener = (...args) => {
      this.removeListener(name, once_listener);
      listener(...args);
    };

    return this.on(name, once_listener);
  }

};
const events = new EventEmitter();
setFireEvent((name, cancellable, ...args) => {
  return events.emit(name, cancellable, ...args);
});
global.Events = events;
setVectorClass(global.Vector = class Vector {
  static fromArray(array) {
    return new Vector(array[0] || 0, array[1] || 0, array[2] || 0);
  }

  static fromObject(object) {
    return new Vector(object.x, object.y, object.z || 0);
  }

  static FromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  static FromAngleCoordinates(radial, angle) {
    return new Vector(Math.cos(angle) * radial, Math.sin(angle) * radial);
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get IsValid() {
    var x = this.x,
        y = this.y,
        z = this.z;
    return !Number.isNaN(x) && Number.isFinite(x) && !Number.isNaN(y) && Number.isFinite(y) && !Number.isNaN(z) && Number.isFinite(z);
  }

  get LengthSqr() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  get Length() {
    return Math.sqrt(this.LengthSqr);
  }

  get Angle() {
    return Math.atan2(this.y, this.x);
  }

  get Polar() {
    let x = this.x,
        theta = Math.atan(this.y / x) * (180 / Math.PI);

    if (x < 0) {
      theta += 180;
    }

    if (theta < 0) {
      theta += 360;
    }

    return theta;
  }

  Equals(vec) {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  IsZero(tolerance = 0.01) {
    var x = this.x,
        y = this.y,
        z = this.z;
    return x > tolerance && x < tolerance && y > tolerance && y < tolerance && z > tolerance && z < tolerance;
  }

  IsLengthGreaterThan(val) {
    return this.LengthSqr > val * val;
  }

  IsLengthLessThan(val) {
    return this.LengthSqr < val * val;
  }

  Invalidate() {
    this.x = this.y = this.z = NaN;
    return this;
  }

  toZero() {
    this.x = this.y = this.z = 0;
    return this;
  }

  Negate() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  Random(minVal, maxVal) {
    this.x = Math.random() * (maxVal - minVal) + minVal;
    this.y = Math.random() * (maxVal - minVal) + minVal;
    this.z = Math.random() * (maxVal - minVal) + minVal;
    return this;
  }

  Min(vec) {
    return new Vector(Math.min(this.x, vec.x), Math.min(this.y, vec.y), Math.min(this.z, vec.z));
  }

  Max(vec) {
    return new Vector(Math.max(this.x, vec.x), Math.max(this.y, vec.y), Math.max(this.z, vec.z));
  }

  Abs() {
    return new Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }

  SquareRoot() {
    return new Vector(Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z));
  }

  SetX(num) {
    this.x = num;
    return this;
  }

  SetY(num) {
    this.y = num;
    return this;
  }

  SetZ(num) {
    this.z = num;
    return this;
  }

  Normalize(scalar) {
    var length = this.Length;

    if (length !== 0) {
      this.DivideScalar(scalar !== undefined ? length * scalar : length);
    }

    return this;
  }

  Cross(vec) {
    return new Vector(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
  }

  Dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  ScaleTo(scalar) {
    var length = this.Length;

    if (length === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else this.MultiplyScalar(scalar / length);

    return this;
  }

  DivideTo(scalar) {
    var length = this.Length;

    if (length === 0) {
      this.toZero();
    } else this.DivideScalar(scalar / length);

    return this;
  }

  Clamp(min, max) {
    const {
      x,
      y,
      z
    } = this,
          max_x = max.x,
          max_y = max.y,
          max_z = max.z;
    return new Vector(Math.min(x > max_x ? max_x : x, min.x), Math.min(y > max_y ? max_y : y, min.y), Math.min(z > max_z ? max_z : z, min.z));
  }

  Add(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  AddScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }

  AddScalarX(scalar) {
    this.x += scalar;
    return this;
  }

  AddScalarY(scalar) {
    this.y += scalar;
    return this;
  }

  AddScalarZ(scalar) {
    this.z += scalar;
    return this;
  }

  Subtract(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  SubtractScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }

  SubtractScalarX(scalar) {
    this.x -= scalar;
    return this;
  }

  SubtractScalarY(scalar) {
    this.y -= scalar;
    return this;
  }

  SubtractScalarZ(scalar) {
    this.z -= scalar;
    return this;
  }

  Multiply(vec) {
    return new Vector(this.x * vec.x, this.y * vec.y, this.z * vec.z);
  }

  MultiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  MultiplyScalarX(scalar) {
    this.x *= scalar;
    return this;
  }

  MultiplyScalarY(scalar) {
    this.y *= scalar;
    return this;
  }

  MultiplyScalarZ(scalar) {
    this.z *= scalar;
    return this;
  }

  Divide(vec) {
    return new Vector(this.x / vec.x, this.y / vec.y, this.z / vec.z);
  }

  DivideScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  DivideScalarX(scalar) {
    this.x /= scalar;
    return this;
  }

  DivideScalarY(scalar) {
    this.y /= scalar;
    return this;
  }

  DivideScalarZ(scalar) {
    this.z /= scalar;
    return this;
  }

  MultiplyAdd(vec, vec2, scalar) {
    return vec.Add(vec2).MultiplyScalar(scalar);
  }

  DistanceSqr(vec) {
    return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2 + (vec.z - this.z) ** 2;
  }

  Distance(vec) {
    return Math.sqrt(this.DistanceSqr(vec));
  }

  Distance2D(vec) {
    return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2);
  }

  GetEntitiesInRange(range) {
    let _a = Entities.GetAllEntities();

    let _f = ent => {
      return ent.m_vecNetworkOrigin.Distance(this) <= range;
    };

    let _r = [];

    for (let _i = _a.length; _i--;) {
      if (_f(_a[_i], _i, _a)) {
        _r.push(_a[_i]);
      }
    }

    return _r;
  }

  FindRotationAngle(from) {
    const ent_pos = from.m_vecNetworkOrigin;
    let angle = Math.abs(Math.atan2(this.y - ent_pos.y, this.x - ent_pos.x) - from.m_vecForward.Angle);

    if (angle > Math.PI) {
      angle = Math.abs(Math.PI * 2 - angle);
    }

    return angle;
  }

  Perpendicular(is_x = true) {
    return is_x ? new Vector(-this.y, this.x, this.z) : new Vector(this.y, -this.x, this.z);
  }

  Rotated(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
  }

  Rotation(rotation, distance) {
    return new Vector(this.x + rotation.x * distance, this.y + rotation.y * distance, this.z + rotation.z * distance);
  }

  RotationRad(rotation, distance) {
    var vec = this.Rotation(rotation, distance);
    return vec.MultiplyScalar(Math.PI).DivideScalar(180);
  }

  RotationTime(rot_speed) {
    return this.Angle / (30 * rot_speed);
  }

  AngleBetweenVectors(vec) {
    return Math.atan2(vec.y - this.y, vec.x - this.x);
  }

  AngleBetweenFaces(front) {
    return Math.acos(this.x * front.x + this.y * front.y);
  }

  Extend(vec, distance) {
    return this.Rotation(Vector.FromAngle(this.AngleBetweenVectors(vec)), distance);
  }

  IsInRange(vec, range) {
    return this.DistanceSqr(vec) < range ** 2;
  }

  IsUnderRectangle(x, y, width, height) {
    return this.x > x && this.x < x + width && this.y > y && this.y < y + height;
  }

  toString() {
    return "Vector(" + this.x + "," + this.y + "," + this.z + ")";
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

});
setVector2DClass(global.Vector2D = class Vector2D {
  static fromArray(array) {
    return new Vector2D(array[0] || 0, array[1] || 0);
  }

  static fromObject(object) {
    return new Vector2D(object.x, object.y);
  }

  static FromAngle(angle) {
    return new Vector2D(Math.cos(angle), Math.sin(angle));
  }

  static FromAngleCoordinates(radial, angle) {
    return new Vector2D(Math.cos(angle) * radial, Math.sin(angle) * radial);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get IsValid() {
    var x = this.x,
        y = this.y;
    return !Number.isNaN(x) && Number.isFinite(x) && !Number.isNaN(y) && Number.isFinite(y);
  }

  get LengthSqr() {
    return this.x ** 2 + this.y ** 2;
  }

  get Length() {
    return Math.sqrt(this.LengthSqr);
  }

  get Angle() {
    return Math.atan2(this.y, this.x);
  }

  get Polar() {
    let x = this.x,
        theta = Math.atan(this.y / x) * (180 / Math.PI);

    if (x < 0) {
      theta += 180;
    }

    if (theta < 0) {
      theta += 360;
    }

    return theta;
  }

  Equals(vec) {
    return this.x === vec.x && this.y === vec.y;
  }

  IsZero(tolerance = 0.01) {
    var x = this.x,
        y = this.y;
    return x > tolerance && x < tolerance && y > tolerance && y < tolerance;
  }

  IsLengthGreaterThan(val) {
    return this.LengthSqr > val * val;
  }

  IsLengthLessThan(val) {
    return this.LengthSqr < val * val;
  }

  Invalidate() {
    this.x = this.y = NaN;
    return this;
  }

  toZero() {
    this.x = this.y = 0;
    return this;
  }

  Negate() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  Random(minVal, maxVal) {
    this.x = Math.random() * (maxVal - minVal) + minVal;
    this.y = Math.random() * (maxVal - minVal) + minVal;
    return this;
  }

  Min(vec) {
    return new Vector2D(Math.min(this.x, vec.x), Math.min(this.y, vec.y));
  }

  Max(vec) {
    return new Vector2D(Math.max(this.x, vec.x), Math.max(this.y, vec.y));
  }

  Abs() {
    return new Vector2D(Math.abs(this.x), Math.abs(this.y));
  }

  SquareRoot() {
    return new Vector2D(Math.sqrt(this.x), Math.sqrt(this.y));
  }

  SetX(num) {
    this.x = num;
    return this;
  }

  SetY(num) {
    this.y = num;
    return this;
  }

  Normalize(scalar) {
    var length = this.Length;

    if (length !== 0) {
      this.DivideScalar(scalar !== undefined ? length * scalar : length);
    }

    return this;
  }

  Cross(vec) {
    return vec.y * this.x - vec.x * this.y;
  }

  Dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  ScaleTo(scalar) {
    var length = this.Length;

    if (length === 0) {
      this.x = 0;
      this.y = 0;
      this.y = 0;
    } else this.MultiplyScalar(scalar / length);

    return this;
  }

  DivideTo(scalar) {
    var length = this.Length;

    if (length === 0) {
      this.toZero();
    } else this.DivideScalar(scalar / length);

    return this;
  }

  Clamp(min, max) {
    const {
      x,
      y
    } = this,
          max_x = max.x,
          max_y = max.y;
    return new Vector2D(Math.min(x > max_x ? max_x : x, min.x), Math.min(y > max_y ? max_y : y, min.y));
  }

  Add(vec) {
    return new Vector2D(this.x + vec.x, this.y + vec.y);
  }

  AddScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  AddScalarX(scalar) {
    this.x += scalar;
    return this;
  }

  AddScalarY(scalar) {
    this.y += scalar;
    return this;
  }

  Subtract(vec) {
    return new Vector2D(this.x - vec.x, this.y - vec.y);
  }

  SubtractScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  SubtractScalarX(scalar) {
    this.x -= scalar;
    return this;
  }

  SubtractScalarY(scalar) {
    this.y -= scalar;
    return this;
  }

  Multiply(vec) {
    return new Vector2D(this.x * vec.x, this.y * vec.y);
  }

  MultiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  MultiplyScalarX(scalar) {
    this.x *= scalar;
    return this;
  }

  MultiplyScalarY(scalar) {
    this.y *= scalar;
    return this;
  }

  Divide(vec) {
    return new Vector2D(this.x / vec.x, this.y / vec.y);
  }

  DivideScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  DivideScalarX(scalar) {
    this.x /= scalar;
    return this;
  }

  DivideScalarY(scalar) {
    this.y /= scalar;
    return this;
  }

  MultiplyAdd(vec, vec2, scalar) {
    return vec.Add(vec2).MultiplyScalar(scalar);
  }

  DistanceSqr(vec) {
    return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2;
  }

  Distance(vec) {
    return Math.sqrt(this.DistanceSqr(vec));
  }

  Distance2D(vec) {
    return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2);
  }

  Perpendicular(is_x = true) {
    return is_x ? new Vector2D(-this.y, this.x) : new Vector2D(this.y, -this.x);
  }

  Rotated(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);
    return new Vector2D(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
  }

  Rotation(rotation, distance) {
    return new Vector2D(this.x + rotation.x * distance, this.y + rotation.y * distance);
  }

  RotationRad(rotation, distance) {
    var vec = this.Rotation(rotation, distance);
    return vec.MultiplyScalar(Math.PI).DivideScalar(180);
  }

  RotationTime(rot_speed) {
    return this.Angle / (30 * rot_speed);
  }

  AngleBetweenVectors(vec) {
    return Math.atan2(vec.y - this.y, vec.x - this.x);
  }

  AngleBetweenFronts(front) {
    return Math.acos(this.x * front.x + this.y * front.y);
  }

  Extend(vec, distance) {
    return this.Rotation(Vector2D.FromAngle(this.AngleBetweenVectors(vec)), distance);
  }

  IsInRange(vec, range) {
    return this.DistanceSqr(vec) < range ** 2;
  }

  IsUnderRectangle(x, y, width, height) {
    return this.x > x && this.x < x + width && this.y > y && this.y < y + height;
  }

  toString() {
    return "Vector2D(" + this.x + "," + this.y + ")";
  }

  toArray() {
    return [this.x, this.y];
  }

});
