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

type TBuildings = Barrack | Filler | Fountain | Outpost | Tower | NeutralItemStash
type TTwinGateData = [Unit, number, Vector3, Vector3, boolean]

new (class CTeleportChanged {
	private readonly buildings: TBuildings[] = []
	private readonly teleports: [Unit, UnitPortalData][] = []
	private readonly teleportPoints: PortalPoint[] = []
	private readonly twinGateTeleports: TTwinGateData[] = []

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
		for (let i = this.twinGateTeleports.length - 1; i > -1; i--) {
			const [caster, startTime, , , isVlalid] = this.twinGateTeleports[i],
				endTime = startTime + 4 + GameState.TickInterval
			if (!isVlalid || GameState.RawGameTime > endTime) {
				this.destroyTwinGatePortal(caster, true)
			}
		}
	}
	protected EntityVisibleChanged(entity: Entity) {
		if (!(entity instanceof Unit) || !entity.IsVisible) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[0].TPStartPosition.CopyFrom(entity.Position)
		}
		const twinGateData = this.twinGateTeleports.find(([x]) => x === entity)
		if (twinGateData !== undefined && !twinGateData[0].IsChanneling) {
			this.destroyTwinGatePortal(twinGateData[0], true)
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
			this.tpTwinGateChanged(particle)
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
			this.twinGateTeleports.removeCallback(([x, ,]) => x === entity)
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
			this.twinGateTeleports.removeCallback(([x, ,]) => x === entity)
		}
	}
	protected GameEnded() {
		for (let i = this.teleportPoints.length - 1; i > -1; i--) {
			this.teleportPoints[i].IsValid = false
		}
		for (let i = this.twinGateTeleports.length - 1; i > -1; i--) {
			this.twinGateTeleports[i][4] = false
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
			if (deletedTP !== undefined) {
				deletedTP[1].IsCanceled = true
				deletedTP[1].IsValid = false
				EventsSDK.emit("UnitPortalDestroyed", false, deletedTP[1])
				this.teleports.remove(deletedTP)
				this.destroyInternalTeleportPoint(deletedTP[0])
			}
			return
		}
		if (released) {
			caster.PredictedPosition.CopyFrom(endPosition)
			caster.LastPredictedPositionUpdate = GameState.RawGameTime
			caster.TPEndPosition.Invalidate()
			caster.TPStartPosition.Invalidate()
			const deletedTP = this.teleports.find(([x]) => x === caster)
			if (deletedTP !== undefined) {
				deletedTP[1].IsValid = false
				EventsSDK.emit("UnitPortalDestroyed", false, deletedTP[1])
				this.teleports.remove(deletedTP)
				this.destroyInternalTeleportPoint(deletedTP[0])
			}
			return
		}
		if (!caster.IsVisible) {
			caster.TPStartPosition.CopyFrom(start)
		}
		const current = this.teleports.find(([x]) => x === caster)
		if (current !== undefined) {
			current[1].UpdateData(entity?.Index, endPosition)
			return
		}

		const [building, isFontain] = this.getBuilding(endPosition),
			travel = caster.GetItemByClass(item_travel_boots),
			travel2 = caster.GetItemByClass(item_travel_boots_2)

		const hasTravel = travel !== undefined,
			hasTravel2 = travel2 !== undefined,
			hasIteration =
				entity !== undefined ||
				isFontain ||
				hasTravel ||
				hasTravel2 ||
				GameState.IsDemo

		const unitClass = new UnitPortalData(caster.Index)
		if (hasTravel2) {
			unitClass.AbilityName = travel2.Name
		} else if (hasTravel) {
			unitClass.AbilityName = travel.Name
		} else if (entity !== undefined) {
			unitClass.AbilityName = item_travel_boots.name
		}

		const portalClass = new PortalPoint(start, endPosition, caster.Index)
		portalClass.InternalSkipIteration = hasIteration

		let maxDuration = 3
		if (building !== undefined) {
			if (building.IsOutpost) {
				maxDuration += 1
			}
			if (hasIteration) {
				maxDuration = hasTravel2 ? maxDuration - 1 : maxDuration
			}
		} else if (hasIteration) {
			maxDuration = hasTravel2 ? maxDuration - 1 : maxDuration
		}
		this.teleportPoints.push(portalClass)
		unitClass.UpdateData(entity?.Index, endPosition)
		unitClass.UpdateDuration(this.teleportPoints, hasIteration, maxDuration)
		this.teleports.push([caster, unitClass])
	}
	private tpFurionChanged(
		particle: NetworkedParticle,
		released: boolean,
		destroyed: boolean
	) {
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
		}
		if (!caster.IsVisible && !isEnded) {
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
		tpNewClass.AbilityName = "furion_teleportation"
		this.teleports.push([caster, tpNewClass])
		this.teleportPoints.push(tpModel)
	}
	private tpTwinGateChanged(particle: NetworkedParticle) {
		const entity = particle.AttachedTo
		if (!(entity instanceof Unit)) {
			return
		}
		if (
			particle.PathNoEcon ===
			"particles/units/heroes/heroes_underlord/abbysal_underlord_portal_owner.vpcf"
		) {
			this.destroyTwinGatePortal(entity, false)
			return
		}
		const teleport = this.twinGateTeleports.find(
			([, time]) => time === GameState.RawGameTime
		)
		if (teleport === undefined) {
			return
		}
		const [caster, , start, end] = teleport
		if (!start.IsValid) {
			start.CopyFrom(entity.Position)
		} else if (!end.IsValid && !start.Equals(entity.Position)) {
			end.CopyFrom(entity.Position)
			const unitClass = new UnitPortalData(caster.Index)
			unitClass.EndPosition.CopyFrom(end)
			unitClass.MaxDuration = 4
			unitClass.AbilityName = "twin_gate_portal_warp"
			EventsSDK.emit("UnitPortalChanged", false, unitClass)
			this.teleports.push([caster, unitClass])
		}
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
		const keen = model.Caster.GetAbilityByClass(tinker_keen_teleport)
		let maxDuration = keen?.MaxChannelTime ?? data[1].MaxDuration
		const [building] = this.getBuilding(model.EndPosition)
		if (building?.IsOutpost) {
			maxDuration += 1
		}
		data[1].MaxDuration = maxDuration
		data[1].AbilityName = keen?.Name ?? data[1].AbilityName
		EventsSDK.emit("UnitPortalChanged", false, data[1])
	}
	private tpTwinGateAnimationChanged(
		unit: Unit | FakeUnit,
		type: number,
		act: GameActivity
	) {
		if (type !== 1 || act !== GameActivity.ACT_DOTA_GENERIC_CHANNEL_1) {
			return
		}

		if (unit instanceof Hero) {
			this.twinGateTeleports.push([
				unit,
				GameState.RawGameTime,
				new Vector3().Invalidate(),
				new Vector3().Invalidate(),
				true
			])
		}
	}
	private isValidTPParticle(particle: NetworkedParticle) {
		return (
			particle.Attach === ParticleAttachment.PATTACH_CUSTOMORIGIN &&
			particle.PathNoEcon === "particles/items2_fx/teleport_end.vpcf"
		)
	}
	private isValidTPTwinGateParticle(particle: NetworkedParticle) {
		if (particle.Attach === ParticleAttachment.PATTACH_OVERHEAD_FOLLOW) {
			return (
				particle.PathNoEcon ===
				"particles/units/heroes/heroes_underlord/abbysal_underlord_portal_owner.vpcf"
			)
		}
		return (
			particle.Attach === ParticleAttachment.PATTACH_POINT_FOLLOW &&
			(particle.PathNoEcon ===
				"particles/base_static/team_portal_dire_active.vpcf" ||
				particle.PathNoEcon === "particles/base_static/team_portal_active.vpcf")
		)
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
	private destroyTwinGatePortal(caster: Unit, isCanceled = false) {
		const data = this.teleports.find(([x]) => x === caster)
		if (data === undefined) {
			return
		}
		data[1].IsCanceled = isCanceled
		EventsSDK.emit("UnitPortalDestroyed", false, data[1])
		this.teleports.removeCallback(
			([x, y]) => x === caster && y.AbilityName === "twin_gate_portal_warp"
		)
		this.twinGateTeleports.removeCallback(([x]) => x === caster)
	}
})()
