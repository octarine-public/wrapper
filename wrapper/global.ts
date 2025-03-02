// @ts-nocheck
/* eslint-disable @typescript-eslint/naming-convention */
import { AABB as _AABB } from "./Base/AABB"
import { Color as _Color } from "./Base/Color"
import { NetworkedParticle as _NetworkedParticle } from "./Base/NetworkedParticle"
import { QAngle as _QAngle } from "./Base/QAngle"
import { Vector2 as _Vector2 } from "./Base/Vector2"
import { Vector3 as _Vector3 } from "./Base/Vector3"
import { Vector4 as _Vector4 } from "./Base/Vector4"
import * as _GameData from "./Data/GameData"
import { GUIInfo as _GUIInfo } from "./GUI/GUIInfo"
import * as _DotaMap from "./Helpers/DotaMap"
import { EntityManager as _EntityManager } from "./Managers/EntityManager"
import { Events as _Events } from "./Managers/Events"
import { EventsSDK as _EventsSDK } from "./Managers/EventsSDK"
import { InputManager as _InputManager } from "./Managers/InputManager"
import { MinimapSDK as _MinimapSDK } from "./Managers/MinimapSDK"
import { ParticlesSDK as _ParticlesSDK } from "./Managers/ParticleManager"
import { PathfinderSDK as _PathfinderSDK } from "./Managers/Pathfinder/PathfinderSDK"
import { TaskManager as _TaskManager } from "./Managers/TaskManager"
import { MenuManager as _Menu } from "./Menu/Menu"
import { CameraSDK as _CameraSDK } from "./Native/CameraSDK"
import { RendererSDK as _RendererSDK } from "./Native/RendererSDK"
import { SoundSDK as _SoundSDK } from "./Native/SoundSDK"
import * as _WASM from "./Native/WASM"
import {
	GameRules as _GameRules,
	LocalPlayer as _LocalPlayer
} from "./Objects/Base/Entity"
import { FakeUnits as _FakeUnits } from "./Objects/Base/FakeUnit"
import { PlayerResource as _PlayerResource } from "./Objects/Base/PlayerResource"
import { AbilityData as _AbilityData } from "./Objects/DataBook/AbilityData"
import { PlayerCustomData as _PlayerCustomData } from "./Objects/DataBook/PlayerCustomData"
import { SDKClasses } from "./Objects/NativeToSDK"
import { EntityDataLumps as _EntityDataLumps } from "./Resources/ParseEntityLump"
import { GridNav as _GridNav } from "./Resources/ParseGNV"
import { GameState as _GameState } from "./Utils/GameState"

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = _Vector3
globalThis.Vector4 = _Vector4
globalThis.AABB = _AABB
globalThis.AbilityData = _AbilityData
globalThis.DotaMap = _DotaMap
globalThis.GameData = _GameData
globalThis.NetworkedParticle = _NetworkedParticle
globalThis.FakeUnits = _FakeUnits
globalThis.SoundSDK = _SoundSDK
globalThis.PathfinderSDK = _PathfinderSDK
globalThis.CameraSDK = _CameraSDK

Object.defineProperty(globalThis, "LocalPlayer", {
	get: () => {
		return _LocalPlayer
	},
	configurable: false,
	enumerable: true
})
globalThis.EntityManager = _EntityManager
globalThis.Events = _Events

Object.defineProperty(globalThis, "PlayerResource", {
	get: () => {
		return _PlayerResource
	},
	configurable: false,
	enumerable: true
})
Object.defineProperty(globalThis, "PlayerCustomData", {
	get: () => {
		return _PlayerCustomData.Array
	},
	configurable: false,
	enumerable: true
})
Object.defineProperty(globalThis, "GameRules", {
	get: () => {
		return _GameRules
	},
	configurable: false,
	enumerable: true
})
globalThis.GameState = _GameState

globalThis.EventsSDK = _EventsSDK
globalThis.RendererSDK = _RendererSDK
Object.defineProperty(globalThis, "GridNav", {
	get: () => {
		return _GridNav
	},
	configurable: false,
	enumerable: true
})
Object.defineProperty(globalThis, "EntityDataLumps", {
	get: () => {
		return _EntityDataLumps
	},
	configurable: false,
	enumerable: true
})
globalThis.GetPositionHeight = _WASM.GetPositionHeight
globalThis.ParticlesSDK = _ParticlesSDK
globalThis.WASM = _WASM
globalThis.MinimapSDK = _MinimapSDK
globalThis.InputManager = _InputManager
globalThis.TaskManager = _TaskManager
globalThis.GUIInfo = _GUIInfo

globalThis.Menu = _Menu
globalThis.GetEntityClassByName = (name: string) => {
	for (const [constr] of SDKClasses) {
		if (constr.name === name) {
			return constr
		}
	}
	return undefined
}
