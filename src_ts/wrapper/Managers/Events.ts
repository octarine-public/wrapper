import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import { default as EntityManager, LocalPlayer } from "./EntityManager"

import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"

import ExecuteOrder from "../Native/ExecuteOrder"
import UserCmd from "../Native/UserCmd"
import Ability from "../Objects/Base/Ability"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import AbilityData from "../Objects/DataBook/AbilityData"

const EventsSDK: EventsSDK = new EventEmitter()

export default EventsSDK

Events.on("WndProc", (...args) => EventsSDK.emit("WndProc", true, ...args))

Events.on("Tick", () => {
	try {
		if (LocalPlayer !== undefined)
			EventsSDK.emit("Tick")
	} catch (e) {
		throw e
	}
})

Events.on("Update", cmd => EventsSDK.emit("Update", false, new UserCmd(cmd)))

Events.on("UnitStateChanged", npc => {
	if (LocalPlayer === undefined)
		return

	EventsSDK.emit("UnitStateChanged", false, EntityManager.GetEntityByNative(npc, true))
})

Events.on("TeamVisibilityChanged", (npc, newTagged) => {
	if (LocalPlayer === undefined)
		return

	const unit = EntityManager.GetEntityByNative(npc, true) as Unit

	const isVisibleForEnemies = Unit.IsVisibleForEnemies(unit, newTagged)
	unit.IsVisibleForEnemies = isVisibleForEnemies

	EventsSDK.emit("TeamVisibilityChanged", false, unit, isVisibleForEnemies, newTagged)
})

Events.on("Draw", () => EventsSDK.emit("Draw"))

Events.on("ParticleCreated", (id, path, particleSystemHandle, attach, target) => EventsSDK.emit (
	"ParticleCreated", false,
	id,
	path,
	particleSystemHandle,
	attach,
	target instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(target)
		: target,
))

Events.on("ParticleDestroyed", (id, destroy_immediately) => EventsSDK.emit (
	"ParticleDestroyed", false,
	id,
	destroy_immediately,
))

Events.on("ParticleUpdated", (id, control_point) => EventsSDK.emit (
	"ParticleUpdated", false,
	id,
	control_point,
	Vector3.fromIOBuffer(),
))

Events.on("ParticleUpdatedEnt", (id, control_point, ent, attach, attachment, include_wearables) => EventsSDK.emit (
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

Events.on("BloodImpact", (target, scale, xnormal, ynormal) => EventsSDK.emit (
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

Events.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => EventsSDK.emit (
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

Events.on("UnitSpeech", (npc, concept, response, recipient_type, level, muteable) => EventsSDK.emit (
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

Events.on("UnitSpeechMute", (npc, delay) => EventsSDK.emit (
	"UnitSpeechMute", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	delay,
))

Events.on("UnitAddGesture", (npc, activity, slot, fade_in, fade_out, playback_rate, sequence_variant) => EventsSDK.emit (
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

Events.on("UnitRemoveGesture", (npc, activity) => EventsSDK.emit (
	"UnitRemoveGesture", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	activity,
))

Events.on("UnitFadeGesture", (npc, activity) => EventsSDK.emit (
	"UnitFadeGesture", false,
	npc instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(npc)
		: npc,
	activity,
))

let m_vecOrigin2ent = new Map<CNetworkOriginCellCoordQuantizedVector, Entity>()
function GetEntityByVecOrigin(vec: CNetworkOriginCellCoordQuantizedVector) {
	let ent = m_vecOrigin2ent.get(vec)
	if (ent === undefined)
		m_vecOrigin2ent.set(vec, ent = EntityManager.AllEntities.find(ent => {
			let node = ent.GameSceneNode_
			return node !== undefined && node.m_vecOrigin === vec
		}) || EntityManager.AllEntities.find(ent => {
			let node = ent.GameSceneNode
			return node !== undefined && node.m_vecOrigin === vec
		}))
	return ent
}

Events.on("NetworkPositionsChanged", vecs => vecs.forEach(vec => {
	let ent = GetEntityByVecOrigin(vec)
	if (ent === undefined)
		return
	let m_vecOrigin = Vector3.fromIOBuffer(vec.m_Value)
	EventsSDK.emit (
		"NetworkPositionChanged", false,
		ent,
		m_vecOrigin,
	)
	ent.OnNetworkPositionChanged(m_vecOrigin)
}))

Events.on("GameSceneNodesChanged", vecs => vecs.forEach(vec => {
	let ent = GetEntityByVecOrigin(vec)
	if (ent === undefined)
		return
	let m_vecOrigin = Vector3.fromIOBuffer(vec.m_Value),
		m_angAbsRotation = QAngle.fromIOBuffer(ent.GameSceneNode.m_angAbsRotation),
		m_flAbsScale = ent.GameSceneNode.m_flAbsScale
	EventsSDK.emit (
		"GameSceneNodeChanged", false,
		ent,
		m_vecOrigin,
		m_angAbsRotation,
		m_flAbsScale,
	)
	ent.OnGameSceneNodeChanged(m_vecOrigin, m_angAbsRotation, m_flAbsScale)
}))
Events.on("EntityDestroyed", ent => {
	// loop-optimizer: KEEP
	m_vecOrigin2ent.forEach((val, key) => {
		if (val === undefined || val.m_pBaseEntity === ent)
			m_vecOrigin2ent.delete(key)
	})
})

Events.on("InputCaptured", is_captured => EventsSDK.emit (
	"InputCaptured", false,
	is_captured,
))

Events.on("NetworkFieldsChanged", map => {
	// loop-optimizer: KEEP
	map.forEach((map2, entity) => {
		let entity_ = EntityManager.GetEntityByNative(entity, true)
		if (entity_ === undefined)
			return
		// loop-optimizer: KEEP
		map2.forEach((ar, trigger) => ar.forEach(([field_name, field_type, array_index]) => {
			if (array_index !== -1 && field_name === "m_hAbilities" && entity_ instanceof Unit) {
				let abil = entity_.m_pBaseEntity.m_hAbilities[array_index]
				entity_.AbilitiesBook.Spells_[array_index] = EntityManager.GetEntityByNative(abil) as Ability || abil
			}
			if (array_index === -1 && field_name === "m_hOwner")
				entity_.Owner_ = entity.m_hOwnerEntity
		}))
	})
})
Events.on("SetEntityName", (entity, new_name) => {
	let entity_ = EntityManager.GetEntityByNative(entity, true)
	if (entity_ === undefined)
		return
	entity_.Name = new_name
	if (entity_ instanceof Ability)
		entity_.AbilityData = new AbilityData((entity as C_DOTABaseAbility).m_pAbilityData)
})

interface EventsSDK extends EventEmitter {
	on(name: "GameConnected", callback: () => void): EventEmitter
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
	 * Emitted about ALL entities that have may be in "Staging" and Is NOT Valid flag (NPC and childs, PhysicalItems and etc.)
	 *
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 *
	 * Emitted ONLY after LocalPlayer created
	 *
	 * CAREFUL !Use this if you know what you are doing!
	 */
	on(name: "EntityPreCreated", callback: (ent: Entity, index: number) => void): EventEmitter
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
	on(name: "TeamVisibilityChanged", callback: (npc: Unit, isVisibleForEnemies: boolean, isVisibleForTeamMask: number) => void): EventEmitter
	on(name: "TrueSightedChanged", callback: (npc: Unit, isTrueSighted: boolean) => void): EventEmitter
	on(name: "HasScepterChanged", callback: (npc: Unit, hasScepter: boolean) => void): EventEmitter
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
	// on(name: "NetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
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
	on(name: "NetworkPositionChanged", listener: (ent: Entity, m_vecOrigin: Vector3) => void): EventEmitter
	on(name: "GameSceneNodeChanged", listener: (ent: Entity, m_vecOrigin: Vector3, m_angAbsRotation: QAngle, m_flAbsScale: number) => void): EventEmitter
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventEmitter
}
