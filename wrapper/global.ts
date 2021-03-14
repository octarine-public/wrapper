// @ts-nocheck
import _Color from "./Base/Color"
import _QAngle from "./Base/QAngle"
import _Vector2 from "./Base/Vector2"
import _Vector3 from "./Base/Vector3"
import { default as _GUIInfo } from "./GUI/GUIInfo"
import _EntityManager from "./Managers/EntityManager"
import _Events from "./Managers/Events"
import _EventsSDK from "./Managers/EventsSDK"
import _Input from "./Managers/InputManager"
import _Manifest from "./Managers/Manifest"
import _MinimapSDK from "./Managers/MinimapSDK"
import _ParticlesSDK from "./Managers/ParticleManager"
import _Menu from "./Menu/Menu"
import _RendererSDK from "./Native/RendererSDK"
import * as _WASM from "./Native/WASM"
import { GameRules as _GameRules, LocalPlayer as _LocalPlayer } from "./Objects/Base/Entity"
import { PlayerResource as _PlayerResource } from "./Objects/Base/PlayerResource"
import { GetSDKClasses } from "./Objects/NativeToSDK"
import _GameState from "./Utils/GameState"
import { EntityDataLump as _EntityDataLump } from "./Utils/ParseEntityLump"
import { GridNav as _GridNav } from "./Utils/ParseGNV"

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = _Vector3

Object.defineProperty(globalThis, "LocalPlayer", {
	get: () => {
		return _LocalPlayer
	},
	configurable: false,
	enumerable: true,
})
Object.defineProperty(globalThis, "WASMIOBuffer", {
	get: () => {
		return _WASM.WASMIOBuffer
	},
	configurable: false,
	enumerable: true,
})
globalThis.EntityManager = _EntityManager
globalThis.Events = _Events

Object.defineProperty(globalThis, "PlayerResource", {
	get: () => {
		return _PlayerResource
	},
	configurable: false,
	enumerable: true,
})
Object.defineProperty(globalThis, "GameRules", {
	get: () => {
		return _GameRules
	},
	configurable: false,
	enumerable: true,
})
globalThis.GameState = _GameState

globalThis.EventsSDK = _EventsSDK
globalThis.RendererSDK = _RendererSDK
Object.defineProperty(globalThis, "GridNav", {
	get: () => {
		return _GridNav
	},
	configurable: false,
	enumerable: true,
})
Object.defineProperty(globalThis, "EntityDataLump", {
	get: () => {
		return _EntityDataLump
	},
	configurable: false,
	enumerable: true,
})
globalThis.GetPositionHeight = _WASM.GetPositionHeight
globalThis.ParticlesSDK = _ParticlesSDK
globalThis.WASM = _WASM
globalThis.Manifest = _Manifest
globalThis.MinimapSDK = _MinimapSDK
globalThis.Input = _Input
globalThis.GUIInfo = _GUIInfo

globalThis.Menu = _Menu
globalThis.GetEntityClassByName = (name: string) => {
	const classes = GetSDKClasses()
	for (const [class_, name_] of classes)
		if (name_ === name)
			return class_
	return undefined
}

// "Don't know how to serialize bigint" fix
/*BigInt.prototype.toJSON = function () {
	return this.toString() + "n"
}*/
