import { default as _Color } from "./Base/Color"
import { default as _QAngle } from "./Base/QAngle"
import { default as _Vector2 } from "./Base/Vector2"
import { default as _Vector3 } from "./Base/Vector3"

import Player from "./Objects/Base/Player"

import { default as _EntityManager } from "./Managers/EntityManager"
import { EventEmitter } from "./Managers/Events"

import { default as _PlayerResource } from "./Objects/GameResources/PlayerResource"
import { default as _Game } from "./Objects/GameResources/GameRules"

import { default as _RendererSDK } from "./Native/RendererSDK"

declare global {
	var Color: typeof _Color
	var QAngle: typeof _QAngle
	var Vector2: typeof _Vector2
	var Vector3: typeof _Vector3

	var LocalPlayer: Nullable<Player>

	var EntityManager: typeof _EntityManager
	var GetEntityClassByName: (name: string) => any[]
	var Events: typeof EventEmitter

	var PlayerResource: typeof _PlayerResource
	var Game: typeof _Game

	var RendererSDK: typeof _RendererSDK

	var WASMIOBuffer: Float32Array
}

globalThis.Color = _Color
globalThis.QAngle = _QAngle
globalThis.Vector2 = _Vector2
globalThis.Vector2 = _Vector2
globalThis.Vector3 = Vector3

globalThis.LocalPlayer = undefined
globalThis.EntityManager = _EntityManager
globalThis.Events = EventEmitter

globalThis.PlayerResource = _PlayerResource
globalThis.Game = _Game

globalThis.RendererSDK = _RendererSDK