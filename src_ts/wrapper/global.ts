import _Color from "./Base/Color"
import _QAngle from "./Base/QAngle"
import _Vector2 from "./Base/Vector2"
import _Vector3 from "./Base/Vector3"

import Player from "./Objects/Base/Player"

import _EntityManager from "./Managers/EntityManager"
import _Events from "./Managers/Events"

import _PlayerResource from "./Objects/GameResources/PlayerResource"
import _Game from "./Objects/GameResources/GameRules"

import _RendererSDK from "./Native/RendererSDK"
import _EventsSDK from "./Managers/EventsSDK"
import _ParticlesSDK from "./Managers/ParticleManager"

import _Menu from "./Menu/Menu"

declare global {
	var Color: typeof _Color
	var QAngle: typeof _QAngle
	var Vector2: typeof _Vector2
	var Vector3: typeof _Vector3

	var LocalPlayer: Nullable<Player>

	var EntityManager: typeof _EntityManager
	var GetEntityClassByName: (name: string) => any[]
	var Events: typeof _Events

	var PlayerResource: typeof _PlayerResource
	var Game: typeof _Game

	var RendererSDK: typeof _RendererSDK
	var EventsSDK: typeof _EventsSDK
	var ParticlesSDK: typeof _ParticlesSDK

	var WASMIOBuffer: Float32Array

	var Menu: typeof _Menu
}

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = _Vector3

globalThis.LocalPlayer = undefined
globalThis.EntityManager = _EntityManager
globalThis.Events = _Events

globalThis.PlayerResource = _PlayerResource
globalThis.Game = _Game

globalThis.EventsSDK = _EventsSDK
globalThis.RendererSDK = _RendererSDK
globalThis.ParticlesSDK = _ParticlesSDK

globalThis.Menu = _Menu
