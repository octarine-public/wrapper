import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { PortalPoint } from "../../Base/PortalPoint"
import { UnitPortalData } from "../../Base/UnitPortalData"
import { Vector3 } from "../../Base/Vector3"
import { EventPriority } from "../../Enums/EventPriority"
import { GameActivity } from "../../Enums/GameActivity"
import { ParticleAttachment } from "../../Enums/ParticleAttachment"
import { tinker_keen_teleport } from "../../Objects/Abilities/Tinker/tinker_keen_teleport"
import { Building } from "../../Objects/Base/Building"
import { Entity } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Hero } from "../../Objects/Base/Hero"
import { Unit } from "../../Objects/Base/Unit"
import { Barrack } from "../../Objects/Buildings/Barrack"
import { Filler } from "../../Objects/Buildings/Filler"
import { Fountain } from "../../Objects/Buildings/Fountain"
import { NeutralItemStash } from "../../Objects/Buildings/NeutralItemStash"
import { Outpost } from "../../Objects/Buildings/Outpost"
import { Tower } from "../../Objects/Buildings/Tower"
import { npc_dota_hero_tinker } from "../../Objects/Heroes/npc_dota_hero_tinker"
import { item_travel_boots } from "../../Objects/Items/item_travel_boots"
import { item_travel_boots_2 } from "../../Objects/Items/item_travel_boots_2"
import { GameState } from "../../Utils/GameState"
import { EventsSDK } from "../EventsSDK"
import { TaskManager } from "../TaskManager"

type IGateData = [[Unit, boolean, string, number, number][], Vector3, Vector3]
type TBuildings = Barrack | Filler | Fountain | Outpost | Tower | NeutralItemStash

new (class CTeleportChanged {
	private readonly buildings: TBuildings[] = []
	private readonly teleports: [Unit, UnitPortalData][] = []
	private readonly teleportPoints: PortalPoint[] = []
	private readonly twinGates: IGateData = [
		[],
		new Vector3().Invalidate(),
		new Vector3().Invalidate()
	]

	constructor() {
		EventsSDK.on(
			"PostDataUpdate",
			this.PostDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAnimation",
			this.UnitAnimation.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ParticleUpdated",
			this.ParticleUpdated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ParticleReleased",
			this.ParticleReleased.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ParticleDestroyed",
			this.ParticleDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityVisibleChanged",
			this.EntityVisibleChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityCreated",
			this.EntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"LifeStateChanged",
			this.LifeStateChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on("EntityDestroyed", this.EntityDestroyed.bind(this))
		EventsSDK.on("GameEnded", this.GameEnded.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on(
			"UnitPortalDestroyed",
			this.UnitPortalDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	protected PostDataUpdate(delta: number) {
		if (delta === 0) {
			return
		}
		for (let i = this.teleportPoints.length - 1; i > -1; i--) {
			const model = this.teleportPoints[i]
			if (!model.IsValid || model.IsExpired) {
				this.teleportPoints.remove(model)
			}
		}
		for (let i = this.teleports.length - 1; i > -1; i--) {
			const [caster, model] = this.teleports[i]
			if (!caster.IsAlive || model.Target === undefined) {
				continue
			}
			if (model.Target.IsAlive) {
				model.EndPosition.CopyFrom(model.Target.Position)
			}
		}
		const rawTime = GameState.RawGameTime,
			[heroes, start, end] = this.twinGates
		if (!start.IsValid || !end.IsValid) {
			return
		}
		if (heroes.length === 0) {
			this.twinGates[1].Invalidate()
			this.twinGates[2].Invalidate()
			return
		}
		for (let i = heroes.length - 1; i > -1; i--) {
			const data = heroes[i]
			const [caster, , abilName, lastUpdate, maxChannelTime] = data
			if (rawTime > lastUpdate) {
				this.destroyTwinGatePortal(caster, true)
				heroes.remove(data)
				continue
			}
			if (data[1]) {
				continue
			}
			const unitClass = new UnitPortalData(caster.Index)
			unitClass.StartPosition.CopyFrom(start)
			unitClass.EndPosition.CopyFrom(end)
			unitClass.MaxDuration = maxChannelTime
			unitClass.AbilityName = abilName
			EventsSDK.emit("UnitPortalChanged", false, unitClass)
			this.teleports.push([caster, unitClass])
			data[1] = true
		}
	}
	protected EntityVisibleChanged(entity: Entity) {
		if (!(entity instanceof Unit) || !entity.IsVisible) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[1].StartPosition.CopyFrom(entity.Position)
			data[0].TPStartPosition.CopyFrom(entity.Position)
		}
	}
	protected UnitAnimation(
		npc: Unit | FakeUnit,
		_seq: number,
		_playBackRate: number,
		_castPoint: number,
		type: number,
		activity: GameActivity,
		_lagCompensationTime: number,
		_rawCastPoint: number
	) {
		this.tpTinkerAnimationChanged(npc, activity)
		this.tpTwinGateAnimationChanged(npc, type, activity)
	}
	protected ParticleUpdated(particle: NetworkedParticle) {
		if (this.isValidTPTwinGateParticle(particle)) {
			this.tpTwinGateChanged(particle, false)
		}
		if (this.isValidTPParticle(particle)) {
			this.tpScrollChanged(particle, false, false)
		}
		if (this.isValidTPFurionParticle(particle)) {
			this.tpFurionChanged(particle, false, false)
		}
	}
	protected ParticleReleased(particle: NetworkedParticle) {
		if (this.isValidTPParticle(particle)) {
			this.tpScrollChanged(particle, true, false)
		}
		if (this.isValidTPFurionParticle(particle)) {
			this.tpFurionChanged(particle, true, false)
		}
	}
	protected ParticleDestroyed(particle: NetworkedParticle) {
		if (this.isValidTPParticle(particle)) {
			this.tpScrollChanged(particle, false, true)
		}
		if (this.isValidTPFurionParticle(particle)) {
			this.tpFurionChanged(particle, false, true)
		}
		if (this.isValidTPTwinGateParticle(particle)) {
			this.tpTwinGateChanged(particle, true)
		}
	}
	protected EntityCreated(entity: Entity) {
		if (this.isValidBuilding(entity)) {
			this.buildings.push(entity)
		}
	}
	protected EntityDestroyed(entity: Entity) {
		if (this.isValidBuilding(entity)) {
			this.buildings.remove(entity)
		}
		if (!(entity instanceof Unit)) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[1].IsValid = false
			EventsSDK.emit("UnitPortalDestroyed", false, data[1])
			this.teleports.remove(data)
			this.twinGates[0].removeCallback(([x, ,]) => x === entity)
		}
	}
	protected LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Unit) || entity.IsAlive) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[1].IsValid = false
			EventsSDK.emit("UnitPortalDestroyed", false, data[1])
			this.teleports.remove(data)
			this.twinGates[0].removeCallback(([x, ,]) => x === entity)
		}
	}
	protected UnitPortalDestroyed(model: UnitPortalData) {
		const caster = model.Caster
		if (caster === undefined) {
			return
		}
		if (model.IsCanceled) {
			caster.PredictedPosition.CopyFrom(model.StartPosition)
			caster.FogVisiblePosition.CopyFrom(model.StartPosition)
			caster.LastPredictedPositionUpdate = GameState.RawGameTime
			return
		}
		caster.PredictedPosition.CopyFrom(model.EndPosition)
		caster.FogVisiblePosition.CopyFrom(model.EndPosition)
		caster.LastPredictedPositionUpdate = GameState.RawGameTime
	}
	protected GameEnded() {
		this.twinGates[0].clear()
		this.twinGates[1].Invalidate()
		this.twinGates[2].Invalidate()
		for (let i = this.teleportPoints.length - 1; i > -1; i--) {
			this.teleportPoints[i].IsValid = false
		}
	}
	private tpScrollChanged(
		particle: NetworkedParticle,
		released: boolean,
		destroyed: boolean
	) {
		const caster = particle.ModifiersAttachedTo,
			color = particle.ControlPoints.get(6),
			start = particle.ControlPointsFallback.get(3)
		if (color === undefined || start === undefined || !(caster instanceof Unit)) {
			return
		}
		let entity: Nullable<Unit>
		const toEntity = particle.ControlPointsEnt.get(0)?.[0]
		if (toEntity instanceof Unit) {
			entity = toEntity
		}
		let endPosition = entity ?? particle.ControlPoints.get(0)
		if (endPosition instanceof Unit) {
			endPosition = endPosition.Position
		}
		if (endPosition === undefined) {
			return
		}
		if (destroyed) {
			caster.TPEndPosition.Invalidate()
			caster.TPStartPosition.Invalidate()
			const deletedTP = this.teleports.find(([x]) => x === caster)
			if (deletedTP === undefined) {
				return
			}
			const [unit, model] = deletedTP
			model.IsCanceled = true
			model.IsValid = false
			EventsSDK.emit("UnitPortalDestroyed", false, model)
			this.teleports.remove(deletedTP)
			this.destroyInternalTeleportPoint(unit)
			return
		}
		if (released) {
			caster.TPEndPosition.Invalidate()
			caster.TPStartPosition.Invalidate()
			const deletedTP = this.teleports.find(([x]) => x === caster)
			if (deletedTP === undefined) {
				return
			}
			const [unit, model] = deletedTP
			model.IsValid = false
			EventsSDK.emit("UnitPortalDestroyed", false, model)
			this.teleports.remove(deletedTP)
			this.destroyInternalTeleportPoint(unit)
			return
		}
		caster.TPStartPosition.CopyFrom(start)
		caster.TPEndPosition.CopyFrom(endPosition)
		const current = this.teleports.find(([x]) => x === caster)
		if (current !== undefined) {
			current[1].UpdateData(entity?.Index, start, endPosition)
			return
		}
		const [building, isFontain] = this.getBuilding(endPosition),
			travel = caster.GetItemByClass(item_travel_boots),
			travel2 = caster.GetItemByClass(item_travel_boots_2),
			keen = caster.GetAbilityByClass(tinker_keen_teleport)

		const hasTravel = travel !== undefined,
			hasTravel2 = travel2 !== undefined,
			hasIteration =
				entity !== undefined ||
				keen !== undefined ||
				isFontain ||
				hasTravel ||
				hasTravel2

		const unitClass = new UnitPortalData(caster.Index)
		if (hasTravel2) {
			unitClass.AbilityName = travel2.Name
		} else if (hasTravel) {
			unitClass.AbilityName = travel.Name
		} else if (entity !== undefined) {
			unitClass.AbilityName = item_travel_boots.name
		} else if (keen !== undefined) {
			unitClass.AbilityName = keen.Name
		}
		const portalClass = new PortalPoint(start, endPosition, caster.Index)
		portalClass.InternalSkipIteration = hasIteration || GameState.IsDemo

		let maxDuration = 3
		if (building !== undefined) {
			if (building.IsOutpost) {
				maxDuration += 1
			}
			if (hasIteration) {
				maxDuration = hasTravel2
					? maxDuration - 1
					: keen !== undefined
						? Math.max(keen.MaxChannelTime, maxDuration)
						: maxDuration
			}
		} else if (hasIteration) {
			maxDuration = hasTravel2 ? maxDuration - 1 : maxDuration
		}

		this.teleportPoints.push(portalClass)
		unitClass.UpdateData(entity?.Index, start, endPosition)
		unitClass.UpdateDuration(this.teleportPoints, hasIteration, maxDuration)
		this.teleports.push([caster, unitClass])
	}
	private tpFurionChanged(
		particle: NetworkedParticle,
		released: boolean,
		destroyed: boolean
	) {
		// TODO: interact with NetworkedParticle Ability
		const caster = particle.AttachedTo ?? particle.ModifiersAttachedTo
		if (caster === undefined || !(caster instanceof Unit)) {
			return
		}
		const position = particle.ControlPoints.get(0) ?? particle.ControlPoints.get(1)
		if (position === undefined) {
			return
		}
		const isEnded =
			particle.PathNoEcon ===
			"particles/units/heroes/hero_furion/furion_teleport_end.vpcf"
		if (destroyed || released) {
			caster.TPEndPosition.Invalidate()
			caster.TPStartPosition.Invalidate()
			const deletedTP = this.teleports.find(([x]) => x === caster)
			if (deletedTP !== undefined) {
				deletedTP[1].IsValid = false
				deletedTP[1].IsCanceled = deletedTP[1].RemainingTime > 0
				EventsSDK.emit("UnitPortalDestroyed", false, deletedTP[1])
				this.teleports.remove(deletedTP)
				this.destroyInternalTeleportPoint(deletedTP[0])
			}
			return
		}
		if (isEnded) {
			caster.TPEndPosition.CopyFrom(position)
		} else {
			caster.TPStartPosition.CopyFrom(position)
		}
		const current = this.teleports.find(([x]) => x === caster)
		if (current !== undefined) {
			const pointData = this.teleportPoints.find(
				x =>
					x.Caster === caster &&
					x.InternalSkipIteration &&
					!x.IsExpired &&
					!x.InternalSkipEmitNotify
			)
			if (isEnded && pointData !== undefined) {
				pointData.InternalSkipIteration = true
				pointData.InternalSkipEmitNotify = true
				pointData.EndPosition.CopyFrom(caster.TPEndPosition)
				current[1].EndPosition.CopyFrom(caster.TPEndPosition)
				current[1].StartPosition.CopyFrom(caster.TPStartPosition)
				EventsSDK.emit("UnitPortalChanged", false, current[1])
			}
			return
		}
		if (isEnded) {
			return
		}
		const tpModel = new PortalPoint(
			position,
			new Vector3().Invalidate(),
			caster.Index
		)
		const tpNewClass = new UnitPortalData(caster.Index)
		tpModel.InternalSkipIteration = true
		// TODO: interact with NetworkedParticle Ability
		tpNewClass.AbilityName = "furion_teleportation"
		this.teleports.push([caster, tpNewClass])
		this.teleportPoints.push(tpModel)
	}
	private tpTwinGateChanged(particle: NetworkedParticle, destroyed: boolean) {
		// TODO: interact with NetworkedParticle Ability
		const entity = particle.AttachedTo
		if (!(entity instanceof Unit)) {
			return
		}
		if (
			particle.PathNoEcon ===
			"particles/units/heroes/heroes_underlord/abbysal_underlord_portal_owner.vpcf"
		) {
			if (destroyed) {
				return
			}
			this.destroyTwinGatePortal(entity, false)
			return
		}
		const [heroes, start, end] = this.twinGates
		if (!destroyed) {
			if (!start.IsValid) {
				start.CopyFrom(entity.Position)
			} else if (!end.IsValid && !start.Equals(entity.Position)) {
				end.CopyFrom(entity.Position)
			}
			return
		}
		if (!start.IsValid || !end.IsValid) {
			return
		}
		// wait portal owner destroy
		TaskManager.Begin(
			() => this.destroyTwinGatePortalByTask(heroes),
			GameState.TickInterval * 3 * 1000
		)
	}
	private tpTinkerAnimationChanged(unit: Unit | FakeUnit, activity: GameActivity) {
		if (!(unit instanceof npc_dota_hero_tinker)) {
			return
		}
		if (activity !== GameActivity.ACT_DOTA_CAST_ABILITY_4) {
			return
		}
		const data = this.teleports.find(([x]) => x === unit)
		if (data === undefined) {
			return
		}
		const model = this.teleportPoints.find(
			x =>
				!x.IsExpired &&
				x.Caster === data[0] &&
				x.EndPosition.Equals(data[1].EndPosition)
		)
		if (model === undefined || model.Caster === undefined) {
			return
		}
		model.InternalSkipIteration = true
		const [building] = this.getBuilding(model.EndPosition)
		const keen = model.Caster.GetAbilityByClass(tinker_keen_teleport)
		let maxDuration = keen?.MaxChannelTime ?? data[1].MaxDuration
		if (building?.IsOutpost) {
			maxDuration += 1
		}
		data[1].MaxDuration = maxDuration
		data[1].AbilityName = keen?.Name ?? data[1].AbilityName
	}
	private tpTwinGateAnimationChanged(
		unit: Unit | FakeUnit,
		type: number,
		act: GameActivity
	) {
		if (type !== 1 || act !== GameActivity.ACT_DOTA_GENERIC_CHANNEL_1) {
			return
		}
		if (!(unit instanceof Hero)) {
			return
		}
		const abil = unit.GetAbilityByName("twin_gate_portal_warp")
		const maxChannelTime = abil?.MaxChannelTime ?? 4
		this.twinGates[0].push([
			unit,
			false,
			abil?.Name ?? "twin_gate_portal_warp",
			GameState.RawGameTime + maxChannelTime,
			maxChannelTime
		])
	}
	private isValidTPParticle(particle: NetworkedParticle) {
		return (
			particle.Attach === ParticleAttachment.PATTACH_CUSTOMORIGIN &&
			particle.PathNoEcon === "particles/items2_fx/teleport_end.vpcf"
		)
	}
	private isValidTPTwinGateParticle(particle: NetworkedParticle) {
		switch (particle.Attach) {
			case ParticleAttachment.PATTACH_POINT_FOLLOW:
				return (
					particle.PathNoEcon ===
						"particles/base_static/team_portal_active.vpcf" ||
					particle.PathNoEcon ===
						"particles/base_static/team_portal_dire_active.vpcf"
				)
			case ParticleAttachment.PATTACH_OVERHEAD_FOLLOW:
				return (
					particle.PathNoEcon ===
					"particles/units/heroes/heroes_underlord/abbysal_underlord_portal_owner.vpcf"
				)
		}
	}
	private isValidTPFurionParticle(particle: NetworkedParticle) {
		return (
			particle.Attach === ParticleAttachment.PATTACH_CUSTOMORIGIN &&
			(particle.PathNoEcon ===
				"particles/units/heroes/hero_furion/furion_teleport.vpcf" ||
				particle.PathNoEcon ===
					"particles/units/heroes/hero_furion/furion_teleport_end.vpcf")
		)
	}
	private isValidBuilding(entity: Entity): entity is TBuildings {
		if (!(entity instanceof Building)) {
			return false
		}
		return (
			entity.IsTower ||
			entity.IsOutpost ||
			entity.IsBarrack ||
			entity instanceof Filler ||
			entity instanceof Fountain ||
			entity instanceof NeutralItemStash
		)
	}
	private getBuilding(endPosition: Vector3): [Nullable<TBuildings>, boolean] {
		let isFontain = false
		this.buildings.orderBy(x => x.Position.Distance2D(endPosition))
		const extract = this.buildings
			.orderBy(x => x.Position.Distance2D(endPosition))
			.find(building => {
				if (!building.IsAlive) {
					return false
				}
				const distance2D = endPosition.Distance2D(building.Position)
				if (building instanceof Fountain && distance2D <= 800) {
					return (isFontain = true)
				}
				return distance2D <= PortalPoint.CheckDistance
			})
		return [extract, isFontain]
	}
	private destroyInternalTeleportPoint(caster: Unit) {
		this.teleportPoints.removeCallback(
			x => x.InternalSkipIteration && x.Caster === caster
		)
	}
	private destroyTwinGatePortal(entity: Unit, isCanceled = false) {
		const findCaster = this.twinGates[0].find(([x]) => x === entity)
		if (findCaster === undefined) {
			return
		}
		const data = this.teleports.find(([x]) => x === findCaster[0])
		if (data === undefined) {
			return
		}
		const [, portal] = data
		portal.IsValid = false
		portal.IsCanceled = isCanceled
		EventsSDK.emit("UnitPortalDestroyed", false, data[1])
		this.teleports.remove(data)
	}
	private destroyTwinGatePortalByTask(
		heroes: [Unit, boolean, string, number, number][]
	) {
		for (let i = heroes.length - 1; i > -1; i--) {
			const heroData = heroes[i]
			this.destroyTwinGatePortal(heroData[0], true)
			heroes.remove(heroData)
		}
		if (heroes.length === 0) {
			this.twinGates[1].Invalidate()
			this.twinGates[2].Invalidate()
		}
	}
})()
