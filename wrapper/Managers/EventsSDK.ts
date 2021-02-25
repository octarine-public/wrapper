import Vector3 from "../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import { ParticleAttachment_t } from "../Enums/ParticleAttachment_t"
import ExecuteOrder from "../Native/ExecuteOrder"
import Entity from "../Objects/Base/Entity"
import Modifier from "../Objects/Base/Modifier"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import Unit from "../Objects/Base/Unit"
import { RecursiveProtobuf } from "../Utils/Protobuf"
import { EventEmitter } from "./Events"

interface EventsSDK extends EventEmitter {
	/**
	 * Emitted when local hero are available
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameStarted", callback: () => void): EventsSDK
	/**
	 * Emitted when game ended
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameEnded", callback: () => void): EventsSDK
	/**
	 * Emitted after all entity properties handlers were called, a.k.a. entity is fully set up
	 * This callback is best suited for use.
	 */
	on(name: "EntityCreated", callback: (ent: Entity) => void): EventsSDK
	on(name: "EntityDestroyed", callback: (ent: Entity) => void): EventsSDK
	/**
	 * Emitted every time GameRules.RawGameTime changes, a.k.a. tick,
	 * right before PostUpdate, but not required to.
	 */
	on(name: "Tick", callback: (dt: number) => void): EventsSDK
	/**
	 * Emitted before every server entity update.
	 * Gets called when game is paused, and might be called faster than actual server ticks.
	 */
	on(name: "PreDataUpdate", callback: () => void): EventsSDK
	/**
	 * Emitted after every server entity update.
	 * Gets called when game is paused, and might be called faster than actual server ticks.
	 */
	on(name: "PostDataUpdate", callback: () => void): EventsSDK
	on(name: "TeamVisibilityChanged", callback: (npc: Unit) => void): EventsSDK
	on(name: "TrueSightedChanged", callback: (npc: Unit) => void): EventsSDK
	on(name: "HasScepterChanged", callback: (npc: Unit) => void): EventsSDK
	on(name: "Draw", callback: () => void): EventsSDK
	on(name: "ParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity | number) => void): EventsSDK
	on(name: "ParticleUpdated", callback: (id: number, controlPoint: number, position: Vector3) => void): EventsSDK
	on(name: "ParticleUpdatedEnt", callback: (
		id: number,
		controlPoint: number,
		ent: Entity | number,
		attach: ParticleAttachment_t,
		attachment: number,
		fallbackPosition: Vector3,
		includeWearables: boolean,
	) => void): EventsSDK
	on(name: "ParticleDestroyed", listener: (id: number, destroy_immediately: boolean) => void): EventsSDK
	on(name: "ParticleReleased", listener: (id: number) => void): EventsSDK
	on(name: "BloodImpact", callback: (target: Entity | number, scale: number, xnormal: number, ynormal: number) => void): EventsSDK
	on(name: "PrepareUnitOrders", callback: (order: ExecuteOrder) => false | any): EventsSDK
	on(name: "LinearProjectileCreated", callback: (proj: LinearProjectile) => void): EventsSDK
	on(name: "LinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventsSDK
	on(name: "TrackingProjectileCreated", callback: (proj: TrackingProjectile) => void): EventsSDK
	on(name: "TrackingProjectileUpdated", callback: (proj: TrackingProjectile) => void): EventsSDK
	on(name: "TrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventsSDK
	on(name: "TrackingProjectilesDodged", callback: (ent: Entity | number, attacks_only: boolean) => void): EventsSDK
	on(name: "UnitAnimation", callback: (
		npc: Unit,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number,
	) => void): EventsSDK
	on(name: "UnitAnimationEnd", callback: (
		npc: Unit,
		snap: boolean,
	) => void): EventsSDK
	on(name: "GameEvent", listener: (event_name: string, obj: any) => void): EventsSDK
	on(name: "UnitSpeech", listener: (
		npc: Unit | number,
		concept: number,
		response: string,
		recipient_type: number,
		level: number,
		muteable: boolean,
		predelay_start: number,
		predelay_range: number,
		flags: number,
	) => void): EventsSDK
	on(name: "UnitSpeechMute", listener: (npc: Unit | number, delay: number) => void): EventsSDK
	on(name: "UnitAddGesture", listener: (
		npc: Unit | number,
		activity: number,
		slot: number,
		fade_in: number,
		fade_out: number,
		playback_rate: number,
		sequence_variant: number,
	) => void): EventsSDK
	on(name: "UnitRemoveGesture", listener: (npc: Unit | number, activity: number) => void): EventsSDK
	on(name: "UnitFadeGesture", listener: (npc: Unit | number, activity: number) => void): EventsSDK
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventsSDK
	on(name: "LifeStateChanged", listener: (ent: Entity) => void): EventsSDK
	on(name: "EntityNameChanged", listener: (ent: Entity) => void): EventsSDK
	on(name: "EntityTeamChanged", listener: (ent: Entity) => void): EventsSDK
	// on(name: "NetworkFieldChanged", listener: (args: NetworkFieldChanged) => void): EventsSDK
	on(name: "NetworkActivityChanged", listener: (npc: Unit) => void): EventsSDK
	on(name: "ModifierCreatedRaw", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ModifierChangedRaw", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ModifierRemovedRaw", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ModifierCreated", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ModifierChanged", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ModifierRemoved", listener: (mod: Modifier) => void): EventsSDK
	on(name: "ServerTick", listener: (
		tick: number,
		host_frametime: number,
		host_frametime_std_deviation: number,
		host_computationtime: number,
		host_computationtime_std_deviation: number,
		host_framestarttime_std_deviation: number,
		host_loss: number,
	) => void): EventsSDK
	on(name: "ServerInfo", listener: (map: RecursiveProtobuf) => void): EventsSDK
	on(name: "RemoveAllStringTables", listener: () => void): EventsSDK
	on(name: "UpdateStringTable", listener: (name: string, update: Map<number, [string, Uint8Array]>) => void): EventsSDK
	on(name: "StartSound", listener: (
		name: string,
		source_ent: Nullable<Entity | number>,
		position: Vector3,
		seed: number,
		start_time: number,
	) => void): EventsSDK
	on(name: "ChatEvent", listener: (
		type: DOTA_CHAT_MESSAGE,
		value: number,
		playerid_1: number,
		playerid_2: number,
		playerid_3: number,
		playerid_4: number,
		playerid_5: number,
		playerid_6: number,
		value2: number,
		value3: number,
	) => void): EventsSDK
}

const EventsSDK: EventsSDK = new EventEmitter()
export default EventsSDK
