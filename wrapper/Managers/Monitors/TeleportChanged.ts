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
import { Unit } from "../../Objects/Base/Unit"
import { Barrack } from "../../Objects/Buildings/Barrack"
import { Filler } from "../../Objects/Buildings/Filler"
import { Fountain } from "../../Objects/Buildings/Fountain"
import { Outpost } from "../../Objects/Buildings/Outpost"
import { Tower } from "../../Objects/Buildings/Tower"
import { npc_dota_hero_tinker } from "../../Objects/Heroes/npc_dota_hero_tinker"
import { item_travel_boots } from "../../Objects/Items/item_travel_boots"
import { item_travel_boots_2 } from "../../Objects/Items/item_travel_boots_2"
import { GameState } from "../../Utils/GameState"
import { EventsSDK } from "../EventsSDK"

type TBuildings = Barrack | Filler | Fountain | Outpost | Tower

new (class CTeleportChanged {
	private readonly buildings: TBuildings[] = []
	private readonly teleports: [Unit, UnitPortalData][] = []
	private readonly teleportPoints: PortalPoint[] = []

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
	protected EntityVisibleChanged(entity: Entity) {
		if (!(entity instanceof Unit) || !entity.IsVisible) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[0].TPStartPosition.CopyFrom(entity.Position)
		}
	}
	protected UnitAnimation(
		npc: Unit | FakeUnit,
		_seq: number,
		_playBackRate: number,
		_castPoint: number,
		_type: number,
		activity: GameActivity,
		_lagCompensationTime: number,
		_rawCastPoint: number
	) {
		if (!this.isValidUnitAnimation(npc, activity)) {
			return
		}
		const data = this.teleports.find(([x]) => x === npc)
		if (data === undefined) {
			return
		}
		const getTeleport = this.teleportPoints.find(
			x =>
				!x.IsExpired &&
				!x.InternalSkipIteration &&
				x.Caster === data[0] &&
				x.EndPosition.Equals(data[1].EndPosition)
		)
		if (getTeleport === undefined || getTeleport.Caster === undefined) {
			return
		}
		getTeleport.IsKeenTeleport = true
		getTeleport.InternalSkipIteration = true
		const keen = getTeleport.Caster.GetAbilityByClass(tinker_keen_teleport)
		getTeleport.AbilityName = keen?.Name ?? getTeleport.AbilityName
		getTeleport.MaxDuration = keen?.MaxChannelTime ?? getTeleport.MaxDuration
		EventsSDK.emit("UnitTPChanged", false, getTeleport)
	}
	protected PostDataUpdate(delta: number) {
		if (delta === 0) {
			return
		}
		for (let i = this.teleportPoints.length - 1; i > -1; i--) {
			const model = this.teleportPoints[i]
			if (!model.IsExpired) {
				continue
			}
			const caster = model.Caster
			const abilityName = model.AbilityName
			const isVisible = caster?.IsVisible ?? false
			if (caster !== undefined && abilityName === "furion_teleport" && !isVisible) {
				caster.PredictedPosition.CopyFrom(model.EndPosition)
				caster.LastPredictedPositionUpdate = GameState.RawGameTime
			}
			this.teleportPoints.remove(model)
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
	}
	protected ParticleUpdated(particle: NetworkedParticle) {
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
			this.teleports.removeCallback(([x]) => x === entity)
		}
	}
	protected LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Unit) || entity.IsAlive) {
			return
		}
		const data = this.teleports.find(([x]) => x === entity)
		if (data !== undefined) {
			data[1].IsValid = false
			this.teleports.removeCallback(([x]) => x === entity)
		}
	}
	protected GameEnded() {
		for (let i = this.teleportPoints.length - 1; i > -1; i--) {
			this.teleportPoints[i].IsValid = false
		}
		this.teleportPoints.clear()
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
			this.teleports.removeCallback(([x]) => x === caster)
			return
		}
		if (released) {
			caster.PredictedPosition.CopyFrom(endPosition)
			caster.LastPredictedPositionUpdate = GameState.RawGameTime
			caster.TPEndPosition.Invalidate()
			caster.TPStartPosition.Invalidate()
			this.teleports.removeCallback(([x]) => x === caster)
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

		const building = this.getBuilding(endPosition)
		const hasTravel = caster.GetItemByClass(item_travel_boots) !== undefined
		const hasTravel2 = caster.GetItemByClass(item_travel_boots_2) !== undefined

		const tpModel = new PortalPoint(start, endPosition, caster.Index)
		tpModel.InternalSkipIteration = hasTravel || hasTravel2 || GameState.IsDemo

		if (building !== undefined) {
			let maxDuration = tpModel.MaxDuration
			if (building.IsOutpost) {
				maxDuration += 1
			} else if (building instanceof Fountain) {
				maxDuration = 3
			}
			if (tpModel.InternalSkipIteration) {
				tpModel.Count = 1
				tpModel.MaxDuration = hasTravel2 ? maxDuration - 1 : maxDuration
				caster.TPLastMaxDuration = maxDuration
			}
		} else if (tpModel.InternalSkipIteration) {
			tpModel.MaxDuration = hasTravel2
				? tpModel.MaxDuration - 1
				: tpModel.MaxDuration
			caster.TPLastMaxDuration = tpModel.MaxDuration
		}

		this.teleportPoints.push(tpModel)
		const tpNewClass = new UnitPortalData(caster.Index)
		tpNewClass.UpdateData(entity?.Index, endPosition)
		tpNewClass.UpdateDuration(this.teleportPoints)
		this.teleports.push([caster, tpNewClass])
		EventsSDK.emit("UnitTPChanged", false, tpModel)
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
			this.teleports.removeCallback(([x]) => x === caster)
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
				EventsSDK.emit("UnitTPChanged", false, pointData)
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
		tpModel.InternalSkipIteration = true
		tpModel.AbilityName = "furion_teleportation"
		const tpNewClass = new UnitPortalData(caster.Index)
		this.teleports.push([caster, tpNewClass])
		this.teleportPoints.push(tpModel)
	}
	private isValidTPParticle(particle: NetworkedParticle) {
		return (
			particle.Attach === ParticleAttachment.PATTACH_CUSTOMORIGIN &&
			particle.PathNoEcon === "particles/items2_fx/teleport_end.vpcf"
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
	private isValidUnitAnimation(
		unit: Unit | FakeUnit,
		type: GameActivity
	): unit is Unit {
		return (
			unit instanceof npc_dota_hero_tinker &&
			type === GameActivity.ACT_DOTA_CAST_ABILITY_4
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
			entity instanceof Fountain
		)
	}
	private getBuilding(endPosition: Vector3) {
		return this.buildings.find(
			x =>
				x.IsAlive &&
				x.Position.Distance2D(endPosition) <=
					(x instanceof Fountain ? 2200 : PortalPoint.CheckDistance)
		)
	}
})()
