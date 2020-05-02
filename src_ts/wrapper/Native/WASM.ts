import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DegreesToRadian } from "../Utils/Math"

export class HeightMap {
	constructor(
		private min_map_coords: Vector2,
		private map_size: Vector2,
	) { }

	public get MinMapCoords(): Vector2 {
		return this.min_map_coords.Clone()
	}

	public get MapSize(): Vector2 {
		return this.map_size.Clone()
	}

	public get MaxMapCoords(): Vector2 {
		return this.min_map_coords.Add(this.map_size)
	}
}

enum HeightMapParseError {
	NONE = 0,
	INVALID_MAGIC = 1,
	UNKNOWN_VERSION = 2,
	ALLOCATION_ERROR = 3,
};

var wasm = new WebAssembly.Instance(new WebAssembly.Module(readFile("wrapper.wasm")), {
	env: {
		emscripten_notify_memory_growth
	}
}).exports as any as {
	_start: () => void
	GetIOBuffer: () => number
	memory: WebAssembly.Memory
	ScreenToWorld: () => void
	WorldToScreen: () => boolean
	ParseVHCG: (ptr: number, size: number) => HeightMapParseError
	GetHeightForLocation: () => void
	GetSecondaryHeightForLocation: () => void
	ScreenToWorldFar: () => void
	my_malloc: (size: number) => number
	my_free: (ptr: number) => void
	ParseImage: (ptr: number, size: number) => number
	ExtractResourceBlock_DATA: (ptr: number, size: number) => boolean
	ExtractResourceBlock_REDI: (ptr: number, size: number) => boolean
	ExtractResourceBlock_NTRO: (ptr: number, size: number) => boolean
	ExtractResourceBlock_RERL: (ptr: number, size: number) => boolean
	MurmurHash2: (ptr: number, size: number, seed: number) => number
	MurmurHash64: (ptr: number, size: number, seed: number) => number
	DecompressLZ4: (ptr: number, size: number) => number
}
declare global {
	var wasm_: typeof wasm
}
globalThis.wasm_ = wasm
wasm._start()

export let WASMIOBuffer: Float32Array
export let WASMIOBufferBU64: BigUint64Array
export let WASMIOBufferU32: Uint32Array
function emscripten_notify_memory_growth(memoryIndex: number) {
	let off = wasm.GetIOBuffer()
	WASMIOBuffer = new Float32Array(wasm.memory.buffer, off)
	WASMIOBufferBU64 = new BigUint64Array(wasm.memory.buffer, off)
	WASMIOBufferU32 = new Uint32Array(wasm.memory.buffer, off)
}
emscripten_notify_memory_growth(0)

export function GetEyeVector(camera_angles: QAngle): Vector3 {
	// TODO: should we use Math.cos(DegreesToRadian(camera_angles.y))?
	return new Vector3(0, Math.cos(DegreesToRadian(camera_angles.x) - Math.cos(DegreesToRadian(camera_angles.y))), -Math.sin(DegreesToRadian(camera_angles.x)))
}

export function GetCameraPosition(camera_position: Vector2, camera_distance: number, camera_angles: QAngle): Vector3 {
	return camera_position.toVector3().SetZ(
		Vector3.fromIOBuffer(Camera.Position)!.z
		+ GetEyeVector(QAngle.fromIOBuffer(Camera.Angles)!).z * Camera.Distance
		- GetEyeVector(camera_angles).z * camera_distance
	)
}

export function ScreenToWorldFar(
	screen: Vector2,
	window_size: Vector2,
	camera_position: QAngle,
	camera_distance: number,
	camera_angles: QAngle,
): Vector3 {
	WASMIOBuffer[0] = screen.x
	WASMIOBuffer[1] = screen.y

	WASMIOBuffer[2] = window_size.x
	WASMIOBuffer[3] = window_size.y

	WASMIOBuffer[4] = camera_position.x
	WASMIOBuffer[5] = camera_position.y
	WASMIOBuffer[6] = camera_position.z

	WASMIOBuffer[7] = camera_angles.x
	WASMIOBuffer[8] = camera_angles.y
	WASMIOBuffer[9] = camera_angles.z

	WASMIOBuffer[10] = camera_distance

	wasm.ScreenToWorldFar()
	return new Vector3(WASMIOBuffer[0], WASMIOBuffer[1], WASMIOBuffer[2])
}

export function WorldToScreen(
	position: Vector3,
	camera_position: Vector3,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Nullable<Vector2> {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position.z

	WASMIOBuffer[3] = camera_position.x
	WASMIOBuffer[4] = camera_position.y
	WASMIOBuffer[5] = camera_position.z

	WASMIOBuffer[6] = camera_angles.x
	WASMIOBuffer[7] = camera_angles.y
	WASMIOBuffer[8] = camera_angles.z

	WASMIOBuffer[9] = camera_distance

	WASMIOBuffer[10] = window_size.x
	WASMIOBuffer[11] = window_size.y

	if (!wasm.WorldToScreen())
		return undefined
	return new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
}

export function ScreenToWorld(
	screen: Vector2,
	camera_position: Vector3,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Vector3 {
	WASMIOBuffer[0] = screen.x
	WASMIOBuffer[1] = screen.y

	WASMIOBuffer[2] = camera_position.x
	WASMIOBuffer[3] = camera_position.y
	WASMIOBuffer[4] = camera_position.z

	WASMIOBuffer[5] = camera_angles.x
	WASMIOBuffer[6] = camera_angles.y
	WASMIOBuffer[7] = camera_angles.z

	WASMIOBuffer[8] = camera_distance

	WASMIOBuffer[9] = window_size.x
	WASMIOBuffer[10] = window_size.y

	wasm.ScreenToWorld()
	return new Vector3(WASMIOBuffer[0], WASMIOBuffer[1], WASMIOBuffer[2])
}

export function ParseImage(buf: ArrayBuffer): [Uint8Array, Vector2] {
	if (buf === undefined)
		return [new Uint8Array(new Array(4).fill(0xFF)), new Vector2(1, 1)]

	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(new Uint8Array(buf))

	addr = wasm.ParseImage(addr, buf.byteLength)
	if (addr === 0)
		throw "Image conversion failed"
	let image_size = new Vector2(WASMIOBufferU32[0], WASMIOBufferU32[1])
	let copy = new Uint8Array(image_size.x * image_size.y * 4)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return [copy, image_size]
}

export function ExtractResourceBlock(buf: ArrayBuffer, type: string): Nullable<[number, number]> {
	let func: (ptr: number, size: number) => boolean
	switch (type) {
		case "DATA":
			func = wasm.ExtractResourceBlock_DATA
			break
		case "REDI":
			func = wasm.ExtractResourceBlock_REDI
			break
		case "NTRO":
			func = wasm.ExtractResourceBlock_NTRO
			break
		case "RERL":
			func = wasm.ExtractResourceBlock_RERL
			break
		default:
			throw `Unsopported block type: ${type}`
	}
	if (buf === undefined)
		return undefined

	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(new Uint8Array(buf))
	if (!func(addr, buf.byteLength))
		return undefined
	return [WASMIOBufferU32[0], WASMIOBufferU32[1]]
}

export function ParseVHCG(buf: ArrayBuffer): Nullable<HeightMap> {
	if (buf === undefined)
		return undefined

	let addr = wasm.my_malloc(buf.byteLength)
	if (addr === 0)
		throw "Memory allocation for VHCG raw data failed"
	let memory = new Uint8Array(wasm.memory.buffer, addr)
	memory.set(new Uint8Array(buf))

	let err = wasm.ParseVHCG(addr, buf.byteLength)
	if (err !== HeightMapParseError.NONE) {
		if (err < 0)
			throw `VHCG parse failed with READ_ERROR ${-err}`
		throw `VHCG parse failed with ${HeightMapParseError[err]}`
	}
	return new HeightMap(
		new Vector2(WASMIOBuffer[0], WASMIOBuffer[1]),
		new Vector2(WASMIOBuffer[2], WASMIOBuffer[3])
	)
}

export function GetHeightForLocation(loc: Vector2): number {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	wasm.GetHeightForLocation()
	return WASMIOBuffer[0]
}

export function GetSecondaryHeightForLocation(loc: Vector2): number {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	wasm.GetSecondaryHeightForLocation()
	return WASMIOBuffer[0]
}

export function MurmurHash2(buf: ArrayBuffer, seed = 0x31415926): number {
	if (buf === undefined)
		buf = new ArrayBuffer(0)

	let buf_addr = wasm.my_malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash2 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(new Uint8Array(buf))

	return wasm.MurmurHash2(buf_addr, buf.byteLength, seed) >>> 0
}

export function MurmurHash64(buf: ArrayBuffer, seed = 0xEDABCDEF): bigint {
	if (buf === undefined)
		buf = new ArrayBuffer(0)

	let buf_addr = wasm.my_malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash64 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(new Uint8Array(buf))

	wasm.MurmurHash64(buf_addr, buf.byteLength, seed)
	return WASMIOBufferBU64[0]
}

export function DecompressLZ4(buf: ArrayBuffer): Uint8Array {
	if (buf === undefined)
		return new Uint8Array()

	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(new Uint8Array(buf))

	addr = wasm.DecompressLZ4(addr, buf.byteLength)
	if (addr === 0)
		throw "LZ4 decompression failed"
	let copy = new Uint8Array(WASMIOBufferU32[0])
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return copy
}
