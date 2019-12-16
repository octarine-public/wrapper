import { default as _Color } from "./Base/Color"
import { default as _QAngle } from "./Base/QAngle"
import { default as _Vector2 } from "./Base/Vector2"
import { default as _Vector3 } from "./Base/Vector3"

import { PlayerNullable } from "./Objects/Base/Player"

import { default as _EntityManager } from "./Managers/EntityManager"
import { EventEmitter } from "./Managers/Events"

import { default as _PlayerResource } from "./Objects/GameResources/PlayerResource"
import { default as _Game } from "./Objects/GameResources/GameRules"

declare global {
	var Color: typeof _Color
	var QAngle: typeof _QAngle
	var Vector2: typeof _Vector2
	var Vector3: typeof _Vector3

	var LocalPlayer: PlayerNullable

	var EntityManager: typeof _EntityManager
	var Events: typeof EventEmitter

	var PlayerResource: typeof _PlayerResource
	var Game: typeof _Game
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