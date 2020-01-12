// @ts-nocheck
import _Color from "./Base/Color"
import _QAngle from "./Base/QAngle"
import _Vector2 from "./Base/Vector2"
import _Vector3 from "./Base/Vector3"

import _EntityManager, { LocalPlayer } from "./Managers/EntityManager"
import _Events from "./Managers/Events"

import _PlayerResource from "./Objects/GameResources/PlayerResource"
import _Game from "./Objects/GameResources/GameRules"

import _RendererSDK from "./Native/RendererSDK"
import _EventsSDK from "./Managers/EventsSDK"
import _ParticlesSDK from "./Managers/ParticleManager"

import _Menu from "./Menu/Menu"
import { GetSDKClasses } from "./Objects/NativeToSDK"
import Player from "./Objects/Base/Player"

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
globalThis.EntityManager = _EntityManager
globalThis.Events = _Events

globalThis.PlayerResource = _PlayerResource
globalThis.Game = _Game

globalThis.EventsSDK = _EventsSDK
globalThis.RendererSDK = _RendererSDK
globalThis.ParticlesSDK = _ParticlesSDK

globalThis.Menu = _Menu
globalThis.GetEntityClassByName = (name: string) => GetSDKClasses().find(c => (c as Constructor<any>).name === name)

