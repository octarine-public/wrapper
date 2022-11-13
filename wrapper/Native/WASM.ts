import { AABB } from "../Base/AABB"
import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { MaterialFlags } from "../Enums/MaterialFlags"
import { fread } from "../Utils/fread"
import { DegreesToRadian } from "../Utils/Math"
import { tryFindFile } from "../Utils/readFile"

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

	public Contains(pos: Vector2 | Vector3): boolean {
		return (
			pos.x >= this.MinMapCoords_.x
			&& pos.x <= this.MinMapCoords_.x + this.MapSize_.x
			&& pos.y >= this.MinMapCoords_.y
			&& pos.y <= this.MinMapCoords_.y + this.MapSize_.y
		)
	}
}
export let HeightMap: Nullable<CHeightMap>

enum HeightMapParseError {
	NONE = 0,
	INVALID_MAGIC = 1,
	UNKNOWN_VERSION = 2,
	ALLOCATION_ERROR = 3,
};

function TryLoadWASMModule(path: string): WebAssembly.Module {
	const realPath = tryFindFile(path, 1)
	if (realPath === undefined)
		throw `${path} not found`
	const wasm_file = fread(realPath)
	if (wasm_file === undefined)
		throw `Coudln't read ${realPath}`

	return new WebAssembly.Module(wasm_file)
}

function GetWASMModule(): WebAssembly.Module {
	try {
		return TryLoadWASMModule("wrapper_simd.wasm")
	} catch {
		return TryLoadWASMModule("wrapper.wasm")
	}
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
		fd_read: () => {
			throw new Error("fd_read is unimplemented")
		},
		fd_write: () => {
			throw new Error("fd_write is unimplemented")
		},
		fd_seek: () => {
			throw new Error("fd_seek is unimplemented")
		},
		fd_close: () => {
			throw new Error("fd_close is unimplemented")
		},
		environ_sizes_get: () => {
			throw new Error("environ_sizes_get is unimplemented")
		},
		environ_get: () => {
			throw new Error("environ_get is unimplemented")
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
	GetLocationAverageHeight: () => void,
	GetCursorRay: () => void,
	ScreenToWorldFar: () => void,
	malloc: (size: number) => number,
	free: (ptr: number) => void,
	MurmurHash2: (ptr: number, size: number, seed: number) => number,
	MurmurHash64: (ptr: number, size: number, seed: number) => void,
	CRC32: (ptr: number, size: number) => number,
	CloneWorldToProjection: () => void,
	WorldToScreenNew: () => boolean,
	DecompressVertexBuffer: (ptr: number, size: number, elem_count: number, elem_size: number) => number,
	DecompressIndexBuffer: (ptr: number, size: number, elem_count: number, elem_size: number) => number,
	ResetWorld: () => void,
	LoadWorldMesh: (
		id: number,
		vertex_ptr: number, vertex_size: number, vertex_elem_size: number,
		index_ptr: number, index_size: number, index_elem_size: number,
		flags: number,
		path_id: number,
	) => void,
	LoadWorldMeshCached: (
		id: number,
		triangles_ptr: number, triangles_size: number,
		nodes_ptr: number, nodes_size: number,
		indices_ptr: number, indices_size: number,
		flags: number,
		path_id: number,
	) => void,
	SpawnWorldMesh: (id: number) => void,
	FinishWorld: (
		nodes_ptr: number, nodes_size: number,
		indices_ptr: number, indices_size: number,
	) => void,
	ExtractWorldBVH: () => void,
	ExtractMeshData: (id: number) => void,
	BatchCheckRayBox: () => void,
}
declare global {
	var wasm_: typeof wasm
}
globalThis.wasm_ = wasm
// wasm._start() // calls proc_exit => unreachable code

export let WASMIOBuffer: Float32Array
export let WASMIOBufferBU64: BigUint64Array
export let WASMIOBufferU32: Uint32Array
export let WASMIOBufferView: DataView
function emscripten_notify_memory_growth(_memoryIndex: number) {
	const off = wasm.GetIOBuffer()
	WASMIOBuffer = new Float32Array(wasm.memory.buffer, off)
	WASMIOBufferBU64 = new BigUint64Array(wasm.memory.buffer, off)
	WASMIOBufferU32 = new Uint32Array(wasm.memory.buffer, off)
	WASMIOBufferView = new DataView(wasm.memory.buffer, off)
}
emscripten_notify_memory_growth(0)

export function GetEyeVector(camera_angles: QAngle): Vector3 {
	// TODO: should we use Math.cos(DegreesToRadian(camera_angles.y))?
	return new Vector3(0, Math.cos(DegreesToRadian(camera_angles.x) - Math.cos(DegreesToRadian(camera_angles.y))), -Math.sin(DegreesToRadian(camera_angles.x)))
}

let camera_offset = 0,
	camera_offset_updated = 0
export function GetCameraPosition(
	camera_position: Vector2,
	camera_distance: number,
	camera_angles: QAngle,
): Vector3 {
	const dist = 96 * 1.5,
		count = 8,
		t = hrtime(),
		eye_vector = GetEyeVector(camera_angles)
	if (camera_offset_updated + 100 < t) {
		camera_offset = GetLocationAverageHeight(
			camera_position
				.Clone()
				.AddScalarX(eye_vector.x * camera_distance)
				.AddScalarY(eye_vector.y * camera_distance),
			count,
			dist,
		)
		camera_offset_updated = t
	}
	return Vector3.FromVector2(camera_position).SetZ(
		camera_offset
		- eye_vector.z * camera_distance
		+ 50,
	)
}

export function GetCursorRay(
	screen: Vector2,
	window_size: Vector2,
	camera_angles: QAngle,
	fov: number,
): Vector3 {
	WASMIOBuffer[0] = window_size.x
	WASMIOBuffer[1] = window_size.y

	WASMIOBuffer[2] = camera_angles.x
	WASMIOBuffer[3] = camera_angles.y
	WASMIOBuffer[4] = camera_angles.z

	WASMIOBuffer[5] = fov

	WASMIOBuffer[6] = screen.x
	WASMIOBuffer[7] = screen.y

	wasm.GetCursorRay()
	return new Vector3(
		WASMIOBuffer[0],
		WASMIOBuffer[1],
		WASMIOBuffer[2],
	)
}

const IOBufferSize = 128,
	max_screens = (IOBufferSize - 12) / 2
export function ScreenToWorldFar(
	screens: Vector2[],
	window_size: Vector2,
	camera_position: Vector3,
	camera_distance: number,
	camera_angles: QAngle,
	fov: number,
	flags = MaterialFlags.Nonsolid | MaterialFlags.Water,
): Vector3[] {
	if (screens.length > max_screens) {
		let res: Vector3[] = []
		for (let i = 0; i < screens.length; i += max_screens) {
			res = [...res, ...ScreenToWorldFar(
				screens.slice(i, i + max_screens),
				window_size,
				camera_position,
				camera_distance,
				camera_angles,
				fov,
				flags,
			)]
		}
		return res
	}
	WASMIOBuffer[0] = window_size.x
	WASMIOBuffer[1] = window_size.y

	WASMIOBuffer[2] = camera_position.x
	WASMIOBuffer[3] = camera_position.y
	WASMIOBuffer[4] = camera_position.z

	WASMIOBuffer[5] = camera_angles.x
	WASMIOBuffer[6] = camera_angles.y
	WASMIOBuffer[7] = camera_angles.z

	WASMIOBuffer[8] = camera_distance

	WASMIOBuffer[9] = fov

	WASMIOBufferU32[10] = flags
	WASMIOBuffer[11] = screens.length

	screens.forEach((screen, i) => {
		WASMIOBuffer[12 + i * 2 + 0] = screen.x
		WASMIOBuffer[12 + i * 2 + 1] = screen.y
	})

	wasm.ScreenToWorldFar()
	return screens.map((_, i) => new Vector3(
		WASMIOBuffer[i * 3 + 0],
		WASMIOBuffer[i * 3 + 1],
		WASMIOBuffer[i * 3 + 2],
	))
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

export function ParseVHCG(stream: ReadableBinaryStream): void {
	try {
		const addr = wasm.malloc(stream.Size)
		if (addr === 0)
			throw "Memory allocation for VHCG raw data failed"
		stream.ReadSliceTo(new Uint8Array(wasm.memory.buffer, addr, stream.Size))

		const err = wasm.ParseVHCG(addr, stream.Size)
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
		console.error("Error in HeightMap init", e)
		HeightMap = undefined
	}
}
export function ResetVHCG(): void {
	HeightMap = undefined
}

export function GetPositionHeight(
	loc: Vector2 | Vector3,
	flags = MaterialFlags.Nonsolid | MaterialFlags.Water,
): number {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y
	WASMIOBufferU32[2] = flags

	wasm.GetHeightForLocation()
	return WASMIOBuffer[0]
}

export function GetLocationAverageHeight(
	position: Vector2,
	count: number,
	distance: number,
	flags = MaterialFlags.Nonsolid | MaterialFlags.Water,
): number {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBufferU32[2] = flags
	WASMIOBuffer[3] = count
	WASMIOBuffer[4] = distance

	wasm.GetLocationAverageHeight()
	return WASMIOBuffer[0]
}

export function MurmurHash2(buf: Uint8Array, seed = 0x31415926): number {
	const buf_addr = wasm.malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash2 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(buf)

	return wasm.MurmurHash2(buf_addr, buf.byteLength, seed) >>> 0
}

export function MurmurHash64(buf: Uint8Array, seed = 0xEDABCDEF): bigint {
	const buf_addr = wasm.malloc(buf.byteLength)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash64 raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, buf.byteLength).set(buf)

	wasm.MurmurHash64(buf_addr, buf.byteLength, seed)
	return WASMIOBufferBU64[0]
}

export function CRC32(stream: ReadableBinaryStream): number {
	const size = stream.Remaining
	const buf_addr = wasm.malloc(size)
	if (buf_addr === 0)
		throw "Memory allocation for MurmurHash2 raw data failed"
	const old_pos = stream.pos
	stream.ReadSliceTo(new Uint8Array(wasm.memory.buffer, buf_addr, size))
	stream.pos = old_pos

	return wasm.CRC32(buf_addr, size) >>> 0
}

export function CloneWorldToProjection(mat: ArrayLike<number>): void {
	WASMIOBuffer.set(mat)
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

export function DecompressVertexBuffer(
	data: Uint8Array,
	elem_count: number,
	elem_size: number,
): Uint8Array {
	const size = data.byteLength
	const buf_addr = wasm.malloc(size)
	if (buf_addr === 0)
		throw "Memory allocation for DecompressVertexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, size).set(data)

	const addr = wasm.DecompressVertexBuffer(buf_addr, size, elem_count, elem_size)
	const copy = new Uint8Array(elem_count * elem_size)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.free(addr)

	return copy
}

export function DecompressIndexBuffer(
	data: Uint8Array,
	elem_count: number,
	elem_size: number,
): Uint8Array {
	const size = data.byteLength
	const buf_addr = wasm.malloc(size)
	if (buf_addr === 0)
		throw "Memory allocation for DecompressIndexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, buf_addr, size).set(data)

	const addr = wasm.DecompressIndexBuffer(buf_addr, size, elem_count, elem_size)
	const copy = new Uint8Array(elem_count * elem_size)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.free(addr)

	return copy
}

export function ResetWorld(): void {
	wasm.ResetWorld()
}

export function LoadWorldMesh(
	id: number,
	vertexBuffer: Uint8Array,
	vertexSize: number,
	indexBuffer: Uint8Array,
	indexSize: number,
	flags: number,
	path_id: number,
): void {
	const vertex_addr = wasm.malloc(vertexBuffer.byteLength)
	if (vertex_addr === 0)
		throw "Memory allocation for LoadWorldMesh vertexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, vertex_addr, vertexBuffer.byteLength).set(vertexBuffer)

	const index_addr = wasm.malloc(indexBuffer.byteLength)
	if (index_addr === 0)
		throw "Memory allocation for LoadWorldMesh indexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, index_addr, indexBuffer.byteLength).set(indexBuffer)

	wasm.LoadWorldMesh(
		id,
		vertex_addr, vertexBuffer.byteLength, vertexSize,
		index_addr, indexBuffer.byteLength, indexSize,
		flags,
		path_id,
	)
}

export function LoadWorldMeshCached(
	id: number,
	triangles: Uint8Array,
	nodes: Uint8Array,
	indices: Uint8Array,
	flags: number,
	path_id: number,
): void {
	const triangles_addr = wasm.malloc(triangles.byteLength)
	if (triangles_addr === 0)
		throw "Memory allocation for LoadWorldMeshCached triangles raw data failed"
	new Uint8Array(wasm.memory.buffer, triangles_addr, triangles.byteLength).set(triangles)

	const nodes_addr = wasm.malloc(nodes.byteLength)
	if (nodes_addr === 0)
		throw "Memory allocation for LoadWorldMeshCached nodes raw data failed"
	new Uint8Array(wasm.memory.buffer, nodes_addr, nodes.byteLength).set(nodes)

	const indices_addr = wasm.malloc(indices.byteLength)
	if (indices_addr === 0)
		throw "Memory allocation for LoadWorldMeshCached indices raw data failed"
	new Uint8Array(wasm.memory.buffer, indices_addr, indices.byteLength).set(indices)

	wasm.LoadWorldMeshCached(
		id,
		triangles_addr, triangles.byteLength,
		nodes_addr, nodes.byteLength,
		indices_addr, indices.byteLength,
		flags,
		path_id,
	)
}

export function SpawnWorldMesh(id: number, transform: ArrayLike<number>): void {
	WASMIOBuffer.set(transform)
	wasm.SpawnWorldMesh(id)
}

export function FinishWorld(cached_bvh?: Nullable<[Uint8Array, Uint8Array]>): void {
	if (cached_bvh !== undefined) {
		const cached_bvh1_addr = wasm.malloc(cached_bvh[0].byteLength)
		if (cached_bvh1_addr === 0)
			throw "Memory allocation for FinishWorld cached_bvh[0] raw data failed"
		new Uint8Array(wasm.memory.buffer, cached_bvh1_addr, cached_bvh[0].byteLength).set(cached_bvh[0])

		const cached_bvh2_addr = wasm.malloc(cached_bvh[1].byteLength)
		if (cached_bvh2_addr === 0)
			throw "Memory allocation for FinishWorld cached_bvh[1] raw data failed"
		new Uint8Array(wasm.memory.buffer, cached_bvh2_addr, cached_bvh[1].byteLength).set(cached_bvh[1])

		wasm.FinishWorld(
			cached_bvh1_addr, cached_bvh[0].byteLength,
			cached_bvh2_addr, cached_bvh[1].byteLength,
		)
	} else
		wasm.FinishWorld(0, 0, 0, 0)
}

export function ExtractWorldBVH(): [Uint8Array, Uint8Array] {
	wasm.ExtractWorldBVH()
	return [
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[0], WASMIOBufferU32[1]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[2], WASMIOBufferU32[3]),
	]
}

export function ExtractMeshData(id: number): Nullable<[number, Uint8Array, Uint8Array, Uint8Array, number, number]> {
	wasm.ExtractMeshData(id)
	if (WASMIOBufferU32[1] === 0 || WASMIOBufferU32[3] === 0 || WASMIOBufferU32[5] === 0)
		return undefined
	return [
		id,
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[0], WASMIOBufferU32[1]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[2], WASMIOBufferU32[3]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[4], WASMIOBufferU32[5]),
		WASMIOBufferU32[6],
		WASMIOBufferU32[7],
	]
}

const max_hitboxes = (IOBufferSize - 7) / (3 * 2)
export function BatchCheckRayBox(
	start_pos: Vector3,
	ray: Vector3,
	hitboxes: AABB[],
): boolean[] {
	if (hitboxes.length > max_hitboxes) {
		let res: boolean[] = []
		for (let i = 0; i < hitboxes.length; i += max_hitboxes) {
			res = [...res, ...BatchCheckRayBox(
				start_pos,
				ray,
				hitboxes.slice(i, i + max_hitboxes),
			)]
		}
		return res
	}
	WASMIOBuffer[0] = start_pos.x
	WASMIOBuffer[1] = start_pos.y
	WASMIOBuffer[2] = start_pos.z

	WASMIOBuffer[3] = ray.x
	WASMIOBuffer[4] = ray.y
	WASMIOBuffer[5] = ray.z

	WASMIOBuffer[6] = hitboxes.length

	hitboxes.forEach((hitbox, i) => {
		WASMIOBuffer[7 + i * 3 * 2 + 0] = hitbox.Base.x + hitbox.MinOffset.x
		WASMIOBuffer[7 + i * 3 * 2 + 1] = hitbox.Base.y + hitbox.MinOffset.y
		WASMIOBuffer[7 + i * 3 * 2 + 2] = hitbox.Base.z + hitbox.MinOffset.z + hitbox.DeltaZ
		WASMIOBuffer[7 + i * 3 * 2 + 3] = hitbox.Base.x + hitbox.MaxOffset.x
		WASMIOBuffer[7 + i * 3 * 2 + 4] = hitbox.Base.y + hitbox.MaxOffset.y
		WASMIOBuffer[7 + i * 3 * 2 + 5] = hitbox.Base.z + hitbox.MaxOffset.z + hitbox.DeltaZ
	})

	wasm.BatchCheckRayBox()
	return hitboxes.map((_, i) => WASMIOBufferView.getUint8(i) !== 0)
}
