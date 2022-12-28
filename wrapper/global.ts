// @ts-nocheck
import { AABB as _AABB } from "./Base/AABB"
import { Color as _Color } from "./Base/Color"
import { NetworkedParticle as _NetworkedParticle } from "./Base/NetworkedParticle"
import { QAngle as _QAngle } from "./Base/QAngle"
import { Vector2 as _Vector2 } from "./Base/Vector2"
import { Vector3 as _Vector3 } from "./Base/Vector3"
import { Vector4 as _Vector4 } from "./Base/Vector4"
import { GUIInfo as _GUIInfo } from "./GUI/GUIInfo"
import * as _DotaMap from "./Helpers/DotaMap"
import { EntityManager as _EntityManager } from "./Managers/EntityManager"
import { Events as _Events } from "./Managers/Events"
import { EventsSDK as _EventsSDK } from "./Managers/EventsSDK"
import { InputManager as _InputManager } from "./Managers/InputManager"
import { MinimapSDK as _MinimapSDK } from "./Managers/MinimapSDK"
import { ParticlesSDK as _ParticlesSDK } from "./Managers/ParticleManager"
import { MenuManager as _Menu } from "./Menu/Menu"
import { RendererSDK as _RendererSDK } from "./Native/RendererSDK"
import * as _WASM from "./Native/WASM"
import { Workers as _Workers } from "./Native/Workers"
import {
	GameRules as _GameRules,
	LocalPlayer as _LocalPlayer,
} from "./Objects/Base/Entity"
import { FakeUnits as _FakeUnits } from "./Objects/Base/FakeUnit"
import { PlayerResource as _PlayerResource } from "./Objects/Base/PlayerResource"
import { SDKClasses } from "./Objects/NativeToSDK"
import { EntityDataLump as _EntityDataLump } from "./Resources/ParseEntityLump"
import { GridNav as _GridNav } from "./Resources/ParseGNV"
import { GameState as _GameState } from "./Utils/GameState"

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = _Vector3
globalThis.Vector4 = _Vector4
globalThis.AABB = _AABB
globalThis.DotaMap = _DotaMap
globalThis.NetworkedParticle = _NetworkedParticle
globalThis.FakeUnits = _FakeUnits

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
globalThis.Workers = _Workers
globalThis.MinimapSDK = _MinimapSDK
globalThis.InputManager = _InputManager
globalThis.GUIInfo = _GUIInfo

globalThis.Menu = _Menu
globalThis.GetEntityClassByName = (name: string) => {
	for (const [constr] of SDKClasses) if (constr.name === name) return constr
	return undefined
}

// "Don't know how to serialize bigint" fix
/*BigInt.prototype.toJSON = function () {
	return this.toString() + "n"
}*/
