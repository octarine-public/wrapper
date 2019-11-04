import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Vector2 from "../Base/Vector2"
import { RendererSDK } from "../Imports"
import EventsSDK from "../Managers/Events"

var wasm = new WebAssembly.Instance(new WebAssembly.Module(readFile("~/wrapper.wasm")), {}).exports
global.wasm = wasm
wasm._start()

var IOBuffer = new Float32Array(wasm.memory.buffer, wasm.GetIOBuffer())

export function OnDraw() {
	let camera_position = Vector3.fromIOBuffer(Camera.Position) || new Vector3()
	IOBuffer[0] = camera_position.x
	IOBuffer[1] = camera_position.y
	IOBuffer[2] = camera_position.z

	let camera_angles = Vector3.fromIOBuffer(Camera.Angle) || new QAngle(60, 90 ,0)
	IOBuffer[3] = camera_angles.x
	IOBuffer[4] = camera_angles.y
	IOBuffer[5] = camera_angles.z
	
	IOBuffer[6] = Camera.Distance || 1134
	IOBuffer[7] = RendererSDK.WindowSize.x / RendererSDK.WindowSize.y

	wasm.CacheFrame()
}

export function WorldToScreenCached(position: Vector3 | Vector2) {
	IOBuffer[0] = position.x
	IOBuffer[1] = position.y
	IOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	return wasm.WorldToScreenCached() ? new Vector2(IOBuffer[0], IOBuffer[1]) : undefined
}

export function WorldToScreen (
	position: Vector3 | Vector2,
	camera_position: Vector3 | Vector2,
	camera_distance: number,
	camera_angles: QAngle,
	aspect_ratio: number
): Vector2 {
	IOBuffer[0] = position.x
	IOBuffer[1] = position.y
	IOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	IOBuffer[3] = camera_position.x
	IOBuffer[4] = camera_position.y
	IOBuffer[5] = camera_position instanceof Vector2
		? Vector3.fromIOBuffer(Camera.Position).z - Math.sin(QAngle.fromIOBuffer(Camera.Angle).x / 180 * Math.PI) * Camera.Distance + Math.sin(camera_angles.x / 180 * Math.PI) * camera_distance
		: camera_position.z

	IOBuffer[6] = camera_angles.x
	IOBuffer[7] = camera_angles.y
	IOBuffer[8] = camera_angles.z
	
	IOBuffer[9] = camera_distance
	IOBuffer[10] = aspect_ratio

	return wasm.WorldToScreen() ? new Vector2(IOBuffer[0], IOBuffer[1]) : undefined
}
