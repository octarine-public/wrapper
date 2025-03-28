import { NetworkedParticle } from "../Base/NetworkedParticle"
import { Vector3 } from "../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { GameActivity } from "../Enums/GameActivity"
import { SOType } from "../Enums/SOType"
import { ExecuteOrder } from "../Native/ExecuteOrder"
import { Ability } from "../Objects/Base/Ability"
import { Entity } from "../Objects/Base/Entity"
import { FakeUnit } from "../Objects/Base/FakeUnit"
import { Modifier } from "../Objects/Base/Modifier"
import { CPlayerResource } from "../Objects/Base/PlayerResource"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import { Unit } from "../Objects/Base/Unit"
import { PlayerCustomData } from "../Objects/DataBook/PlayerCustomData"
import { RecursiveProtobuf } from "../Utils/Protobuf"
import { EventEmitter } from "./Events"

interface EventsSDK extends EventEmitter {
	/**
	 * Emitted when local hero are available
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameStarted", callback: () => void, priority?: number): EventEmitter
	/**
	 * Emitted when game ended
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameEnded", callback: () => void, priority?: number): EventEmitter
	/**
	 * Emitted before all EntityCreateds.
	 * Same as EntityCreated, but have much less global guarantees
	 * [such as Owner might not be initialized if it was emitted in the same entities packet,
	 * white EntityCreated guarantees that it'll be initialized in that case]
	 */
	on(
		name: "PreEntityCreated",
		callback: (ent: Entity) => void,
		priority?: number
	): EventEmitter
	/**
	 * Emitted after all entity properties handlers were called, a.k.a. entity is fully set up
	 * This callback is best suited for use.
	 */
	on(
		name: "EntityCreated",
		callback: (ent: Entity) => void,
		priority?: number
	): EventEmitter
	on(
		name: "EntityDestroyed",
		callback: (ent: Entity) => void,
		priority?: number
	): EventEmitter
	on(
		name: "EntityTeamChanged",
		listener: (ent: Entity) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description Equivalently to Entity#IsVisible
	 */
	on(
		name: "EntityVisibleChanged",
		listener: (entity: Entity) => void,
		priority?: number
	): EventEmitter
	on(
		name: "FakeUnitCreated",
		listener: (unit: FakeUnit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "FakeUnitDestroyed",
		listener: (unit: FakeUnit) => void,
		priority?: number
	): EventEmitter
	/**
	 * Emitted every time GameRules.RawGameTime changes, a.k.a. tick,
	 * right after PostUpdate
	 * @deprecated
	 */
	on(name: "Tick", callback: (dt: number) => void, priority?: number): EventEmitter
	/**
	 * Emitted before every server entity update.
	 * Gets called when game is paused, and might be called faster than actual server ticks.
	 */
	on(name: "PreDataUpdate", callback: () => void, priority?: number): EventEmitter
	/**
	 * Emitted after every server entity update.
	 * Gets called when game is paused, and might be called faster than actual server ticks.
	 */
	on(
		name: "PostDataUpdate",
		callback: (dt: number) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ControllableByPlayerMaskChanged",
		callback: (npc: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TrueSightedChanged",
		callback: (npc: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "HasScepterChanged",
		callback: (npc: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "HasShardChanged",
		callback: (npc: Unit) => void,
		priority?: number
	): EventEmitter
	on(name: "PreDraw", callback: () => void, priority?: number): EventEmitter
	on(name: "Draw", callback: () => void, priority?: number): EventEmitter
	on(
		name: "ParticleCreated",
		callback: (particle: NetworkedParticle) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ParticleUpdated",
		callback: (particle: NetworkedParticle) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ParticleUnitPositionUpdated",
		callback: (unit: FakeUnit | Unit, particle: Nullable<NetworkedParticle>) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ParticleReleased",
		listener: (particle: NetworkedParticle) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ParticleDestroyed",
		listener: (particle: NetworkedParticle) => void,
		priority?: number
	): EventEmitter
	on(
		name: "PrepareUnitOrders",
		callback: (order: ExecuteOrder) => false | any,
		priority?: number
	): EventsSDK
	on(
		name: "DebuggerPrepareUnitOrders",
		callback: (
			order: ExecuteOrder,
			is_user_input: boolean,
			was_cancelled: boolean
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "LinearProjectileCreated",
		callback: (proj: LinearProjectile) => void,
		priority?: number
	): EventEmitter
	on(
		name: "LinearProjectileDestroyed",
		callback: (proj: LinearProjectile) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TrackingProjectileCreated",
		callback: (proj: TrackingProjectile) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TrackingProjectileUpdated",
		callback: (proj: TrackingProjectile) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TrackingProjectileDestroyed",
		callback: (proj: TrackingProjectile) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TrackingProjectilesDodged",
		callback: (ent: Unit | FakeUnit, attacks_only: boolean) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitAnimation",
		callback: (
			npc: Unit | FakeUnit,
			sequenceVariant: number,
			playbackrate: number,
			castpoint: number,
			type: number,
			activity: number,
			lagCompensationTime: number,
			rawCastPoint: number
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitAnimationEnd",
		callback: (npc: Unit | FakeUnit, snap: boolean) => void,
		priority?: number
	): EventEmitter
	on(
		name: "GameEvent",
		listener: (event_name: string, obj: any) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitSpeech",
		listener: (
			npc: Nullable<Unit | FakeUnit>,
			concept: number,
			response: string,
			recipient_type: number,
			level: number,
			muteable: boolean,
			predelay_start: number,
			predelay_range: number,
			flags: number,
			responseType: number
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitSpeechMute",
		listener: (npc: Nullable<Unit | FakeUnit>, delay: number) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitAddGesture",
		listener: (
			npc: Nullable<Unit | FakeUnit>,
			activity: GameActivity,
			slot: number,
			fade_in: number,
			fade_out: number,
			playback_rate: number,
			sequence_variant: number
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitRemoveGesture",
		listener: (npc: Nullable<Unit | FakeUnit>, activity: number) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitRemoveAllGestures",
		listener: (npc: Nullable<Unit | FakeUnit>) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitFadeGesture",
		listener: (npc: Nullable<Unit | FakeUnit>, activity: number) => void,
		priority?: number
	): EventEmitter
	on(
		name: "InputCaptured",
		listener: (is_captured: boolean) => void,
		priority?: number
	): EventEmitter
	on(
		name: "GameStateChanged",
		listener: (newState: DOTAGameState) => void,
		priority?: number
	): EventEmitter
	on(
		name: "LifeStateChanged",
		listener: (ent: Entity) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitAbilitiesChanged",
		listener: (ent: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitWearablesChanged",
		listener: (ent: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitItemsChanged",
		listener: (ent: Unit) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description Emitted if the properties of an unit have changed
	 * example:
	 * Unit#IsClone
	 * Unit#IsRanged
	 * Unit#IsIllusion
	 * Unit#AttackCapabilities
	 * Unit#IsStrongIllusion
	 * SpiritBear#ShouldRespawn
	 * */
	on(
		name: "UnitPropertyChanged",
		listener: (unit: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "NetworkActivityChanged",
		listener: (npc: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ModifierCreated",
		listener: (mod: Modifier) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ModifierChanged",
		listener: (mod: Modifier) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ModifierChangedVBE",
		listener: (mod: Modifier) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitVBEModifierChanged",
		listener: (unit: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ModifierRemoved",
		listener: (mod: Modifier) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitAbilityDataUpdated",
		listener: () => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitTeamVisibilityChanged",
		listener: (unit: Unit) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description Includes fog of war
	 */
	on(
		name: "UnitLevelChanged",
		listener: (unit: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ServerTick",
		listener: (
			tick: number,
			host_computationtime: number,
			host_computationtime_std_deviation: number,
			legacy_host_loss: number,
			host_unfiltered_frametime: number,
			hltv_replay_flags: number,
			expected_long_tick: number,
			expected_long_tick_reason: string,
			host_frame_dropped_pct_x10: number,
			host_frame_irregular_arrival_pct_x10: number
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ServerInfo",
		listener: (map: RecursiveProtobuf) => void,
		priority?: number
	): EventEmitter
	on(
		name: "RemoveAllStringTables",
		listener: () => void,
		priority?: number
	): EventEmitter
	on(
		name: "UpdateStringTable",
		listener: (name: string, update: Map<number, [string, ArrayBuffer]>) => void,
		priority?: number
	): EventEmitter
	on(
		name: "StartSound",
		listener: (
			name: string,
			source_ent: Nullable<Unit | FakeUnit>,
			position: Vector3,
			seed: number,
			start_time: number
		) => void,
		priority?: number
	): EventEmitter
	on(
		name: "ChatEvent",
		listener: (
			type: DOTA_CHAT_MESSAGE,
			value: number,
			playerid_1: number,
			playerid_2: number,
			playerid_3: number,
			playerid_4: number,
			playerid_5: number,
			playerid_6: number,
			value2: number,
			value3: number
		) => void,
		priority?: number
	): EventEmitter
	on(name: "MapDataLoaded", listener: () => void, priority?: number): EventEmitter
	on(name: "WindowSizeChanged", listener: () => void, priority?: number): EventEmitter
	on(
		name: "MatchmakingStatsUpdated",
		listener: (msg: RecursiveMap) => void,
		priority?: number
	): EventEmitter
	on(
		name: "SharedObjectChanged",
		listener: (typeID: SOType, reason: number, msg: RecursiveMap) => void,
		priority?: number
	): EventEmitter
	on(name: "LocalTeamChanged", listener: () => void, priority?: number): EventEmitter
	on(
		name: "HumanizerStateChanged",
		listener: () => void,
		priority?: number
	): EventEmitter
	on(
		name: "PlayerResourceUpdated",
		listener: (playerResource: CPlayerResource) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description Includes PlayerResourceUpdated
	 */
	on(
		name: "PlayerCustomDataUpdated",
		listener: (player: PlayerCustomData) => void,
		priority?: number
	): EventEmitter
	on(
		name: "AttackStarted",
		callback: (unit: Unit, castpoint: number, names: string[]) => void,
		priority?: number
	): EventEmitter
	on(
		name: "AttackEnded",
		listener: (unit: Unit) => void,
		priority?: number
	): EventEmitter
	on(
		name: "AbilityPhaseChanged",
		listener: (ability: Ability) => void,
		priority?: number
	): EventEmitter
	on(
		name: "AbilityChannelingChanged",
		listener: (ability: Ability) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description Includes fog of war
	 */
	on(
		name: "AbilityLevelChanged",
		listener: (abil: Ability) => void,
		priority?: number
	): EventEmitter
	/**
	 * @description NOTE: Includes only changed by network
	 */
	on(
		name: "AbilityCooldownChanged",
		listener: (ability: Ability) => void,
		priority?: number
	): EventEmitter
	on(
		name: "AbilityHiddenChanged",
		listener: (ability: Ability) => void,
		priority?: number
	): EventEmitter
	on(
		name: "WorldLayerVisibilityChanged",
		listener: (layerName: string, state: boolean) => void,
		priority?: number
	): EventEmitter
	on(
		name: "WorldLayersVisibilityChanged",
		listener: () => void,
		priority?: number
	): EventEmitter
	on(
		name: "MenuConfigChanged",
		listener: (obj: { [key: string]: any }) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TaskReleased",
		listener: (handleID: bigint) => void,
		priority?: number
	): EventEmitter
	on(
		name: "TaskCancelled",
		listener: (handleID: bigint) => void,
		priority?: number
	): EventEmitter
	on(
		name: "EntityPositionChanged",
		listener: (entity: Entity) => void,
		priority?: number
	): EventEmitter
	on(
		name: "UnitStateChanged",
		listener: (entity: Unit) => void,
		priority?: number
	): EventEmitter
}

export const EventsSDK: EventsSDK = new EventEmitter()
