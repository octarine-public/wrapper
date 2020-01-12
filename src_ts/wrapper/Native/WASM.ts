import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import RendererSDK from "../Native/RendererSDK"

var wasm = new WebAssembly.Instance(new WebAssembly.Module(readFile("wrapper.wasm")), {
	env: {
		emscripten_notify_memory_growth
	}
}).exports as any as {
	_start: () => void,
	CacheFrame: () => void,
	GetIOBuffer: () => number,
	memory: WebAssembly.Memory,
	ScreenToWorld: () => void,
	ScreenToWorldCached: () => void,
	WorldToScreen: () => boolean,
	WorldToScreenCached: () => boolean,
	my_malloc: (size: number) => number,
	my_free: (ptr: number) => void,
	ParseImage: (ptr: number, size: number) => number
}
declare global {
	var wasm_: typeof wasm
	var WASMIOBuffer: Float32Array
}
globalThis.wasm_ = wasm
wasm._start()

let WASMIOBuffer: Float32Array
function emscripten_notify_memory_growth(memoryIndex: number) {
	WASMIOBuffer = globalThis.WASMIOBuffer = new Float32Array(wasm.memory.buffer, wasm.GetIOBuffer())
}
emscripten_notify_memory_growth(0)

export function OnDraw() {
	if (!RendererSDK.AlternateW2S)
		return
	let camera_position = Vector3.fromIOBuffer(Camera.Position) ?? new Vector3()
	WASMIOBuffer[0] = camera_position.x
	WASMIOBuffer[1] = camera_position.y
	WASMIOBuffer[2] = camera_position.z

	let camera_angles = QAngle.fromIOBuffer(Camera.Angles)!
	WASMIOBuffer[3] = camera_angles.x
	WASMIOBuffer[4] = camera_angles.y
	WASMIOBuffer[5] = camera_angles.z

	WASMIOBuffer[6] = Camera.Distance ?? 1134

	WASMIOBuffer[7] = RendererSDK.WindowSize.x
	WASMIOBuffer[8] = RendererSDK.WindowSize.y

	wasm.CacheFrame()
}

export function WorldToScreenCached(position: Vector3 | Vector2): Nullable<Vector2> {
	if (!RendererSDK.AlternateW2S)
		return WorldToScreen(position, Vector3.fromIOBuffer(Camera.Position)!, Camera.Distance ?? 1134, QAngle.fromIOBuffer(Camera.Angles)!, RendererSDK.WindowSize)
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	if (!wasm.WorldToScreenCached())
		return undefined
	return new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
}

export function ScreenToWorldCached(screen: Vector2): Vector3 {
	if (!RendererSDK.AlternateW2S)
		return ScreenToWorld(screen, Vector3.fromIOBuffer(Camera.Position)!, Camera.Distance ?? 1134, QAngle.fromIOBuffer(Camera.Angles)!, RendererSDK.WindowSize)
	WASMIOBuffer[0] = screen.x
	WASMIOBuffer[1] = screen.y
	wasm.ScreenToWorldCached()
	return new Vector3(WASMIOBuffer[0], WASMIOBuffer[1], WASMIOBuffer[2])
}

export function WorldToScreen(
	position: Vector3 | Vector2,
	camera_position: Vector3 | Vector2,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Nullable<Vector2> {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	WASMIOBuffer[3] = camera_position.x
	WASMIOBuffer[4] = camera_position.y
	WASMIOBuffer[5] = camera_position instanceof Vector2
		? Vector3.fromIOBuffer(Camera.Position)!.z - Math.sin(camera_angles.x / 180 * Math.PI) * Camera.Distance + Math.sin(camera_angles.x / 180 * Math.PI) * camera_distance
		: camera_position.z

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
	camera_position: Vector3 | Vector2,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Vector3 {
	WASMIOBuffer[0] = screen.x
	WASMIOBuffer[1] = screen.y

	WASMIOBuffer[2] = camera_position.x
	WASMIOBuffer[3] = camera_position.y
	WASMIOBuffer[4] = camera_position instanceof Vector2
		? Vector3.fromIOBuffer(Camera.Position)!.z - Math.sin(camera_angles.x / 180 * Math.PI) * Camera.Distance + Math.sin(camera_angles.x / 180 * Math.PI) * camera_distance
		: camera_position.z

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
	let memory = new Uint8Array(wasm.memory.buffer, addr)
	memory.set(new Uint8Array(buf))

	addr = wasm.ParseImage(addr, buf.byteLength)
	if (addr === 0)
		throw "Image conversion failed"
	let image_size = new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
	let copy = new Uint8Array(image_size.x * image_size.y * 4)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return [copy, image_size]
}
