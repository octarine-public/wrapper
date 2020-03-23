// @ts-nocheck
import _Color from "./Base/Color"
import _QAngle from "./Base/QAngle"
import _Vector2 from "./Base/Vector2"
import _Vector3 from "./Base/Vector3"

import _EntityManager from "./Managers/EntityManager"
import _Events from "./Managers/Events"

import { PlayerResource } from "./Objects/Base/PlayerResource"
import { GameRules } from "./Objects/Base/GameRules"
import _GameState from "./Utils/GameState"

import _RendererSDK from "./Native/RendererSDK"
import _EventsSDK from "./Managers/EventsSDK"
import _ParticlesSDK from "./Managers/ParticleManager"

import _Menu from "./Menu/Menu"
import { GetSDKClasses } from "./Objects/NativeToSDK"
import { LocalPlayer } from "./Objects/Base/Entity"
import * as _WASM from "./Native/WASM"
import _Manifest from "./Managers/Manifest"

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = _Vector3

Object.defineProperty(globalThis, "LocalPlayer", {
	get: () => {
		return LocalPlayer
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
		return PlayerResource
	},
	configurable: false,
	enumerable: true,
})
Object.defineProperty(globalThis, "GameRules", {
	get: () => {
		return GameRules
	},
	configurable: false,
	enumerable: true,
})
globalThis.GameState = _GameState

globalThis.EventsSDK = _EventsSDK
globalThis.RendererSDK = _RendererSDK
globalThis.ParticlesSDK = _ParticlesSDK
globalThis.WASM = _WASM
globalThis.Manifest = _Manifest

globalThis.Menu = _Menu
globalThis.GetEntityClassByName = (name: string) => GetSDKClasses().find(c => (c as Constructor<any>).name === name)

// "Don't know how to serialize bigint" fix
/*BigInt.prototype.toJSON = function () {
	return this.toString() + "n"
}*/
