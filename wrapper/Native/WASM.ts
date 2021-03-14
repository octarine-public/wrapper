import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DegreesToRadian } from "../Utils/Math"
import { ParseResourceLayout } from "../Utils/ParseResource"
import readFile from "../Utils/readFile"

export class CHeightMap {
	constructor(
		private readonly MinMapCoords_: Vector2,
		private readonly MapSize_: Vector2,
	) { }

	public get MinMapCoords(): Vector2 {
		return this.MinMapCoords_.Clone()
	}

	public get MapSize(): Vector2 {
		return this.MapSize_.Clone()
	}

	public get MaxMapCoords(): Vector2 {
		return this.MinMapCoords_.Add(this.MapSize_)
	}
}
export let HeightMap: Nullable<CHeightMap>

enum HeightMapParseError {
	NONE = 0,
	INVALID_MAGIC = 1,
	UNKNOWN_VERSION = 2,
	ALLOCATION_ERROR = 3,
};

function GetWASMModule(): WebAssembly.Module {
	const wasm_file = readFile("wrapper.wasm")
	if (wasm_file === undefined)
		throw "wrapper.wasm not found"

	return new WebAssembly.Module(wasm_file)
}

const WASI_ESUCCESS = 0
const WASI_ENOSYS = 52
const wasm = new WebAssembly.Instance(GetWASMModule(), {
	env: {
		emscripten_notify_memory_growth,
	},
	wasi_snapshot_preview1: {
		proc_exit: () => {
			return WASI_ENOSYS
		},
		args_get: () => {
			return WASI_ESUCCESS
		},
		args_sizes_get: (argc: number, argvBufSize: number) => {
			const view = new DataView(wasm.memory.buffer)
			view.setUint32(argc, 0)
			view.setUint32(argvBufSize, 0)
			return WASI_ESUCCESS
		},
	},
}).exports as any as {
	_start: () => void,
	GetIOBuffer: () => number,
	memory: WebAssembly.Memory,
	ScreenToWorld: () => void,
	WorldToScreen: () => boolean,
	ParseVHCG: (ptr: number, size: number) => HeightMapParseError,
	GetHeightForLocation: () => void,
	GetSecondaryHeightForLocation: () => void,
	ScreenToWorldFar: () => void,
	my_malloc: (size: number) => number,
	my_free: (ptr: number) => void,
	ParsePNG: (data: number, size: number) => number,
	ParseVTex: (data: number, size: number, image_data: number) => number,
	MurmurHash2: (ptr: number, size: number, seed: number) => number,
	MurmurHash64: (ptr: number, size: number, seed: number) => void,
	CRC32: (ptr: number, size: number) => number,
	DecompressLZ4: (ptr: number, size: number, dst_len: number) => number,
	DecompressLZ4Chained: (ptr: number, input_sizes_ptr: number, output_sizes_ptr: number, count: number) => number,
	CloneWorldToProjection: () => void,
	WorldToScreenNew: () => boolean,
}
declare global {
	var wasm_: typeof wasm
}
globalThis.wasm_ = wasm
// wasm._start() // calls proc_exit => unreachable code

export let WASMIOBuffer: Float32Array
export let WASMIOBufferBU64: BigUint64Array
export let WASMIOBufferU32: Uint32Array
function emscripten_notify_memory_growth(_memoryIndex: number) {
	const off = wasm.GetIOBuffer()
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
	const camera_pos = Camera.Position ? Vector3.fromIOBuffer() : new Vector3()
	const camera_ang = Camera.Angles ? QAngle.fromIOBuffer() : new QAngle()
	return camera_position.toVector3().SetZ(
		GetEyeVector(camera_ang).z * Camera.Distance
		+ Math.max(
			camera_pos.z - GetEyeVector(camera_angles).z * camera_distance,
			camera_distance + 500,
		),
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

function ParsePNG(buf: Uint8Array): [Uint8Array, Vector2] {
	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(buf)

	addr = wasm.ParsePNG(addr, buf.byteLength)
	if (addr === 0)
		throw "PNG Image conversion failed: WASM failure"
	const image_size = new Vector2(WASMIOBufferU32[0], WASMIOBufferU32[1])
	const copy = new Uint8Array(image_size.x * image_size.y * 4)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return [copy, image_size]
}

export function ParseImage(buf: Uint8Array): [Uint8Array, Vector2] {
	if (buf.byteLength > 8 && new BigUint64Array(buf.buffer, buf.byteOffset, 8)[0] === 0x0A1A0A0D474E5089n)
		return ParsePNG(buf)

	const layout = ParseResourceLayout(buf)
	if (layout === undefined)
		throw "Image conversion failed"

	const data_block = layout[0].get("DATA")
	if (data_block === undefined)
		throw "Image conversion failed: missing DATA block"
	if (data_block.byteLength < 40)
		throw "Image conversion failed: too small file"
	// TODO: add check that's real VTEX file (lookup https://github.com/SteamDatabase/ValveResourceFormat/blob/master/ValveResourceFormat/Resource/Resource.cs)
	if (new Uint16Array(data_block.buffer, data_block.byteOffset, 2)[0] !== 1)
		throw `Image conversion failed: unknown VTex version`

	const data_size = buf.byteLength - data_block.byteOffset
	let addr = wasm.my_malloc(data_size)
	new Uint8Array(wasm.memory.buffer, addr).set(buf.subarray(data_block.byteOffset))

	addr = wasm.ParseVTex(addr, buf.byteLength, addr + data_block.byteLength)
	if (addr === 0)
		throw "Image conversion failed: WASM failure"
	const image_size = new Vector2(WASMIOBufferU32[0], WASMIOBufferU32[1])
	const copy = new Uint8Array(image_size.x * image_size.y * 4)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return [copy, image_size]
}

export function ParseVHCG(buf: Uint8Array): void {
	try {
		const addr = wasm.my_malloc(buf.byteLength)
		if (addr === 0)
			throw "Memory allocation for VHCG raw data failed"
		const memory = new Uint8Array(wasm.memory.buffer, addr)
		memory.set(buf)

		const err = wasm.ParseVHCG(addr, buf.byteLength)
		if (err !== HeightMapParseError.NONE) {
			if (err < 0)
				throw `VHCG parse failed with READ_ERROR ${-err}`
			throw `VHCG parse failed with ${HeightMapParseError[err]}`
		}
		HeightMap = new CHeightMap(
			new Vector2(WASMIOBuffer[0], WASMIOBuffer[1]),
			new Vector2(WASMIOBuffer[2], WASMIOBuffer[3]),
		)
	} catch (e) {
		console.log("Error in HeightMap init: " + e)
		HeightMap = undefined
	}
}
export function ResetVHCG(): void {
	HeightMap = undefined
}

export function GetPositionHeight(loc: Vector2): number {
	if (HeightMap === undefined)
		return 0
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	wasm.GetHeightForLocation()
	return WASMIOBuffer[0]
}

export function GetPositionSecondaryHeight(loc: Vector2): number {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	wasm.GetSecondaryHeightForLocation()
	return WASMIOBuffer[0]
}

export function MurmurHash2(buf: Uint8Array, seed = 0x31415926): number {
	const buf_addr = wasm.my_malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash2 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(buf)

	return wasm.MurmurHash2(buf_addr, buf.byteLength, seed) >>> 0
}

export function MurmurHash64(buf: Uint8Array, seed = 0xEDABCDEF): bigint {
	const buf_addr = wasm.my_malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash64 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(buf)

	wasm.MurmurHash64(buf_addr, buf.byteLength, seed)
	return WASMIOBufferBU64[0]
}

export function CRC32(buf: Uint8Array): number {
	const buf_addr = wasm.my_malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash2 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(buf)

	return wasm.CRC32(buf_addr, buf.byteLength) >>> 0
}

export function DecompressLZ4(buf: Uint8Array, dst_len: number): Uint8Array {
	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(buf)

	addr = wasm.DecompressLZ4(addr, buf.byteLength, dst_len)
	if (addr === 0)
		throw "LZ4 decompression failed"
	const copy = new Uint8Array(dst_len)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return copy
}

export function DecompressLZ4Chained(
	buf: Uint8Array,
	input_sizes: number[],
	output_sizes: number[],
): Uint8Array {
	if (input_sizes.length !== output_sizes.length)
		throw "Input and output count should match"
	const count = input_sizes.length
	let addr = wasm.my_malloc(buf.byteLength)
	new Uint8Array(wasm.memory.buffer, addr).set(buf)
	const inputs_addr = wasm.my_malloc(count * 4)
	new Uint32Array(wasm.memory.buffer, inputs_addr).set(input_sizes)
	const outputs_addr = wasm.my_malloc(count * 4)
	new Uint32Array(wasm.memory.buffer, outputs_addr).set(output_sizes)

	addr = wasm.DecompressLZ4Chained(addr, inputs_addr, outputs_addr, count)
	if (addr === 0)
		throw "LZ4 decompression failed"
	const copy = new Uint8Array(output_sizes.reduce((prev, cur) => prev + cur, 0))
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return copy
}

export function CloneWorldToProjection(): void {
	WASMIOBuffer.set(IOBuffer.slice(0, 16))
	wasm.CloneWorldToProjection()
}

export function WorldToScreenNew(
	position: Vector3,
	window_size: Vector2,
): Nullable<Vector2> {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position.z

	WASMIOBuffer[3] = window_size.x
	WASMIOBuffer[4] = window_size.y

	if (!wasm.WorldToScreenNew())
		return undefined
	return new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
}
