import { EventEmitter } from "./Events"
import UserCmd from "../Native/UserCmd"
import ExecuteOrder from "../Native/ExecuteOrder"
import Vector3 from "../Base/Vector3"

import Entity from "../Objects/Base/Entity"
import Unit from "../Objects/Base/Unit"
import Hero from "../Objects/Base/Hero"

import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"

import Modifier from "../Objects/Base/Modifier"
import { RecursiveProtobuf } from "../Utils/ParseProtobuf"

interface EventsSDK extends EventEmitter {
	/**
	 * Emitted when local hero and local player are available
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameStarted", callback: (localHero: Hero) => void): EventEmitter
	/**
	 * Emitted when game ended
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameEnded", callback: () => void): EventEmitter
	/**
	 * Emitted about ALL entities that have Valid flag. This callback is best suited for use.
	 *
	 * Also, this event emitted about ALL entities that have already been created (and valids) before reloading scripts
	 *
	 * Emitted ONLY after LocalPlayer created
	 */
	on(name: "EntityCreated", callback: (ent: Entity) => void): EventEmitter
	on(name: "EntityDestroyed", callback: (ent: Entity) => void): EventEmitter
	/**
	 * Every ~33ms. Emitted after LocalPlayer has been created
	 */
	on(name: "Tick", callback: () => void): EventEmitter
	on(name: "Update", callback: (cmd: UserCmd) => void): EventEmitter
	on(name: "TeamVisibilityChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "TrueSightedChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "HasScepterChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "Draw", callback: () => void): EventEmitter
	on(name: "ParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity | number) => void): EventEmitter
	on(name: "ParticleUpdated", callback: (id: number, controlPoint: number, position: Vector3) => void): EventEmitter
	on(name: "ParticleUpdatedEnt", callback: (
		id: number,
		controlPoint: number,
		ent: Entity | number,
		attach: ParticleAttachment_t,
		attachment: number,
		fallbackPosition: Vector3,
		includeWearables: boolean,
	) => void): EventEmitter
	on(name: "ParticleDestroyed", listener: (id: number, destroy_immediately: boolean) => void): EventEmitter
	on(name: "BloodImpact", callback: (target: Entity | number, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "PrepareUnitOrders", callback: (order: ExecuteOrder) => false | any): EventEmitter
	on(name: "LinearProjectileCreated", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "LinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "TrackingProjectileCreated", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "TrackingProjectileUpdated", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "TrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "TrackingProjectilesDodged", callback: (ent: Entity | number, attacks_only: boolean) => void): EventEmitter
	on(name: "UnitAnimation", callback: (
		npc: Unit,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number,
	) => void): EventEmitter
	on(name: "UnitAnimationEnd", callback: (
		npc: Unit,
		snap: boolean,
	) => void): EventEmitter
	on(name: "GameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "CustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "UnitSpeech", listener: (
		npc: Unit | number,
		concept: number,
		response: string,
		recipient_type: number,
		level: number,
		muteable: boolean,
	) => void): EventEmitter
	on(name: "UnitSpeechMute", listener: (npc: Unit | number, delay: number) => void): EventEmitter
	on(name: "UnitAddGesture", listener: (
		npc: Unit | number,
		activity: number,
		slot: number,
		fade_in: number,
		fade_out: number,
		playback_rate: number,
		sequence_variant: number,
	) => void): EventEmitter
	on(name: "UnitRemoveGesture", listener: (npc: Unit | number, activity: number) => void): EventEmitter
	on(name: "UnitFadeGesture", listener: (npc: Unit | number, activity: number) => void): EventEmitter
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventEmitter
	on(name: "LifeStateChanged", listener: (ent: Entity) => void): EventEmitter
	on(name: "EntityNameChanged", listener: (ent: Entity) => void): EventEmitter
	on(name: "EntityTeamChanged", listener: (ent: Entity) => void): EventEmitter
	// on(name: "NetworkFieldChanged", listener: (args: NetworkFieldChanged) => void): EventEmitter
	on(name: "NetworkActivityChanged", listener: (npc: Unit) => void): EventEmitter
	on(name: "ModifierCreatedRaw", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ModifierChangedRaw", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ModifierRemovedRaw", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ModifierCreated", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ModifierChanged", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ModifierRemoved", listener: (mod: Modifier) => void): EventEmitter
	on(name: "ServerTick", listener: (
		tick: number,
		host_frametime: number,
		host_frametime_std_deviation: number,
		host_computationtime: number,
		host_computationtime_std_deviation: number,
		host_framestarttime_std_deviation: number,
		host_loss: number
	) => void): EventEmitter
	on(name: "ServerInfo", listener: (map: RecursiveProtobuf) => void): EventEmitter
}

const EventsSDK: EventsSDK = new EventEmitter()
export default EventsSDK
