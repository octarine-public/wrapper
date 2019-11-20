import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import { default as EntityManager, Game, LocalPlayer, SetLocalPlayer } from "./EntityManager"

import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"

import ExecuteOrder from "../Native/ExecuteOrder"
import UserCmd from "../Native/UserCmd"
import Ability from "../Objects/Base/Ability"
import Item from "../Objects/Base/Item"
import Player from "../Objects/Base/Player"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import AbilityData from "../Objects/DataBook/AbilityData"

import * as WASM from "../Native/WASM"

const EventsSDK: EventsSDK = new EventEmitter()
export default EventsSDK

Events.on("WndProc", (...args) => EventsSDK.emit("WndProc", true, ...args))

Events.on("Update", cmd => EventsSDK.emit("Update", false, new UserCmd(cmd)))

Events.on("UnitStateChanged", npc => {
	if (LocalPlayer === undefined)
		return

	EventsSDK.emit("UnitStateChanged", false, EntityManager.GetEntityByNative(npc, true))
})

Events.on("TeamVisibilityChanged", (npc, newTagged) => {
	const unit = EntityManager.GetEntityByNative(npc, true) as Unit

	unit.IsVisibleForTeamMask = newTagged
	unit.IsVisibleForEnemies = Unit.IsVisibleForEnemies(unit, unit.IsVisibleForTeamMask)

	EventsSDK.emit("TeamVisibilityChanged", false, unit)
})

Events.on("Draw", () => {
	WASM.OnDraw()
	EventsSDK.emit("Draw")
})

Events.on("ParticleCreated", (id, path, particleSystemHandle, attach, target) => EventsSDK.emit(
	"ParticleCreated", false,
	id,
	path,
	particleSystemHandle,
	attach,
	target instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(target)
		: target,
))

Events.on("ParticleDestroyed", (id, destroy_immediately) => EventsSDK.emit(
	"ParticleDestroyed", false,
	id,
	destroy_immediately,
))

Events.on("ParticleUpdated", (id, control_point) => EventsSDK.emit(
	"ParticleUpdated", false,
	id,
	control_point,
	Vector3.fromIOBuffer(),
))

Events.on("ParticleUpdatedEnt", (id, control_point, ent, attach, attachment, include_wearables) => EventsSDK.emit(
	"ParticleUpdatedEnt", false,
	id,
	control_point,
	ent instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(ent)
		: ent,
	attach,
	attachment,
	Vector3.fromIOBuffer(),
	include_wearables,
))

Events.on("BloodImpact", (target, scale, xnormal, ynormal) => EventsSDK.emit(
	"BloodImpact", false,
	target instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(target)
		: target,
	scale,
	xnormal,
	ynormal,
))

Events.on("PrepareUnitOrders", order => {
	const ordersSDK = ExecuteOrder.fromNative(order)

	if (ordersSDK === undefined)
		return true

	return EventsSDK.emit("PrepareUnitOrders", true, ordersSDK)
})

Events.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => EventsSDK.emit(
	"UnitAnimation", false,
	EntityManager.GetEntityByNative(npc),
	sequenceVariant,
	playbackrate,
	castpoint,
	type,
	activity,
))

Events.on("CustomGameEvent", (...args) => EventsSDK.emit("CustomGameEvent", false, ...args))
Events.on("UnitAnimationEnd", (npc, snap) => EventsSDK.emit("UnitAnimationEnd", false, EntityManager.GetEntityByNative(npc), snap))

Events.on("UnitSpeech", (npc, concept, response, recipient_type, level, muteable) => EventsSDK.emit(
	"UnitSpeech", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	concept,
	response,
	recipient_type,
	level,
	muteable,
))

Events.on("UnitSpeechMute", (npc, delay) => EventsSDK.emit(
	"UnitSpeechMute", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	delay,
))

Events.on("UnitAddGesture", (npc, activity, slot, fade_in, fade_out, playback_rate, sequence_variant) => EventsSDK.emit(
	"UnitAddGesture", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	activity,
	slot,
	fade_in,
	fade_out,
	playback_rate,
	sequence_variant,
))

Events.on("UnitRemoveGesture", (npc, activity) => EventsSDK.emit(
	"UnitRemoveGesture", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	activity,
))

Events.on("UnitFadeGesture", (npc, activity) => EventsSDK.emit(
	"UnitFadeGesture", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	activity,
))

Events.on("EntityPositionsChanged", ents => ents.forEach(ent_ => {
	let ent = EntityManager.GetEntityByNative(ent_)
	if (ent === undefined || !ent_.m_VisualData)
		return // probably ent.m_pGameSceneNode === undefined

	let m_vecOrigin = Vector3.fromIOBuffer()
	let m_angAbsRotation = QAngle.fromIOBuffer(true, 3)
	ent.OnGameSceneNodeChanged(m_vecOrigin, m_angAbsRotation)
}))

Events.on("InputCaptured", is_captured => EventsSDK.emit(
	"InputCaptured", false,
	is_captured,
))

/*class NetworkFieldChanged {
	private value: any
	private value_cached = false
	constructor(
		public readonly TriggerEnt: Entity,
		public Trigger: any,
		public readonly FieldName: string,
		public readonly FieldType: string,
		public readonly ArrayIndex: number,
	) {}

	public get Value() {
		if (!this.value_cached) {
			this.value = this.Trigger[this.FieldName]
			if (this.ArrayIndex !== -1)
				this.value = this.value[this.ArrayIndex]
		}
		return this.value
	}
}*/

Events.on("NetworkFieldsChanged", map => {
	// loop-optimizer: KEEP
	map.forEach((map2, native_ent) => {
		let entity = EntityManager.GetEntityByNative(native_ent, true)
		if (entity === undefined)
			return
		// loop-optimizer: KEEP
		map2.forEach((ar, trigger) => ar.forEach(([field_name, field_type, array_index]) => {
			/*EventsSDK.emit (
				"NetworkFieldChanged",
				false,
				new NetworkFieldChanged (
					entity,
					trigger,
					field_name,
					field_type,
					array_index,
				),
			)*/
			if (array_index === -1)
				switch (field_name) {
					case "m_hOwnerEntity":
						entity.Owner_ = entity.m_pBaseEntity.m_hOwnerEntity
						break
					case "m_iPlayerID":
						if (entity instanceof Player) {
							entity.PlayerID = entity.m_pBaseEntity.m_iPlayerID
							if (entity.PlayerID !== -1 && entity.m_pBaseEntity.m_bIsLocalPlayer)
								SetLocalPlayer(entity)
						}
						break
					case "m_hAssignedHero":
						if (entity instanceof Player)
							entity.Hero_ = entity.m_pBaseEntity.m_hAssignedHero
						break
					case "m_iTeamNum":
						entity.Team = entity.m_pBaseEntity.m_iTeamNum
						break
					case "m_lifeState":
						entity.LifeState = entity.m_pBaseEntity.m_lifeState
						EventsSDK.emit("LifeStateChanged", false, entity)
						break
					case "m_NetworkActivity":
						if (entity instanceof Unit) {
							entity.NetworkActivity = entity.m_pBaseEntity.m_NetworkActivity
							EventsSDK.emit("NetworkActivityChanged", false, entity)
						}
						break
					case "m_iIsControllableByPlayer64":
						if (entity instanceof Unit)
							entity.IsControllableByPlayerMask = entity.m_pBaseEntity.m_iIsControllableByPlayer64
						break
					case "m_iHealth":
						entity.HP = entity.m_pBaseEntity.m_iHealth
						break
					case "m_iMaxHealth":
						entity.MaxHP = entity.m_pBaseEntity.m_iMaxHealth
						break
					case "m_flHealthThinkRegen":
						if (entity instanceof Unit)
							entity.HPRegen = entity.m_pBaseEntity.m_flHealthThinkRegen
						break
					case "m_flManaThinkRegen":
						if (entity instanceof Unit)
							entity.ManaRegen = entity.m_pBaseEntity.m_flManaThinkRegen
						break
					case "m_anglediff":
						if (entity instanceof Unit)
							entity.RotationDifference = entity.m_pBaseEntity.m_anglediff
						break
					case "m_iLevel":
						if (entity instanceof Ability)
							entity.Level = entity.m_pBaseEntity.m_iLevel
						break
					case "m_fCooldown":
						if (entity instanceof Ability)
							entity.Cooldown = entity.m_pBaseEntity.m_fCooldown
						break
					case "m_flCooldownLength":
						if (entity instanceof Ability)
							entity.CooldownLength = entity.m_pBaseEntity.m_flCooldownLength
						break
					case "m_bInAbilityPhase":
						if (entity instanceof Ability)
							entity.IsInAbilityPhase = entity.m_pBaseEntity.m_bInAbilityPhase
						break
					case "m_flCastStartTime":
						if (entity instanceof Ability)
							entity.CastStartTime = entity.m_pBaseEntity.m_flCastStartTime
						break
					case "m_flChannelStartTime":
						if (entity instanceof Ability)
							entity.ChannelStartTime = entity.m_pBaseEntity.m_flChannelStartTime
						break
					case "m_bToggleState":
						if (entity instanceof Ability)
							entity.IsToggled = entity.m_pBaseEntity.m_bToggleState
						break
					case "m_flLastCastClickTime":
						if (entity instanceof Ability)
							entity.LastCastClickTime = entity.m_pBaseEntity.m_flLastCastClickTime
						break

					// manually whitelisted
					case "m_angRotation":
						entity.OnNetworkRotationChanged()
						break
					case "m_fGameTime":
						Game.RawGameTime = Game.m_GameRules.m_fGameTime

						EntityManager.AllEntities.forEach(ent => {
							if (ent instanceof Unit && ent.IsVisible)
								ent.LastVisibleTime = Game.RawGameTime;
						})

						if (LocalPlayer !== undefined)
							EventsSDK.emit("Tick", false)
						break
					case "m_bGamePaused":
						Game.IsPaused = Game.m_GameRules.m_bGamePaused
						break

					default:
						break
				}
			else
				switch (field_name) {
					case "m_hAbilities":
						if (entity instanceof Unit) {
							let abil = entity.m_pBaseEntity.m_hAbilities[array_index]
							entity.AbilitiesBook.Spells_[array_index] = EntityManager.GetEntityByNative(abil) as Ability || abil
						}
						break

					// manually whitelisted
					case "m_hItems":
						if (entity instanceof Unit) {
							let item = entity.m_pBaseEntity.m_Inventory.m_hItems[array_index]
							entity.Inventory.TotalItems_[array_index] = EntityManager.GetEntityByNative(item) as Item || item
						}
						break

					default:
						break
				}
		}))
	})
})
Events.on("SetEntityName", (entity, new_name) => {
	let entity_ = EntityManager.GetEntityByNative(entity, true)
	if (entity_ === undefined)
		return
	entity_.Name_ = new_name
	if (entity_ instanceof Ability)
		entity_.AbilityData = new AbilityData((entity as C_DOTABaseAbility).m_pAbilityData)
})

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
	on(name: "EntityCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	on(name: "EntityDestroyed", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Analog (w/o hwnd) - https://docs.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633573(v%3Dvs.85)
	 *
	 * messageType: https://www.autoitscript.com/autoit3/docs/appendix/WinMsgCodes.htm
	 */
	on(name: "WndProc", callback: (messageType: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	/**
	 * Every ~33ms. Emitted after LocalPlayer has been created
	 */
	on(name: "Tick", callback: () => void): EventEmitter
	on(name: "Update", callback: (cmd: UserCmd) => void): EventEmitter
	on(name: "UnitStateChanged", callback: (npc: Unit) => void): EventEmitter
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
	/**
	 * Also, this event emitted about ALL buffs(modifiers) that have already been created (and valids) before reloading scripts
	 */
	on(name: "BuffAdded", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "BuffRemoved", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "BuffStackCountChanged", listener: (buff: Modifier) => void): EventEmitter
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
	// on(name: "NetworkFieldChanged", listener: (args: NetworkFieldChanged) => void): EventEmitter
	on(name: "NetworkActivityChanged", listener: (npc: Unit) => void): EventEmitter
}
