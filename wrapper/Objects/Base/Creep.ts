import Vector3 from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import DotaMap from "../../Helpers/DotaMap"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { GameRules } from "./Entity"
import Unit from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Creep")
export default class Creep extends Unit {
	public readonly PredictedPosition = new Vector3().Invalidate()
	public PredictedIsWaitingToSpawn = true
	public Lane = MapArea.Unknown

	public get IsCreep(): boolean {
		return true
	}
	public get IsLaneCreep(): boolean {
		return this.ClassName === "CDOTA_BaseNPC_Creep_Lane" || this.ClassName === "CDOTA_BaseNPC_Creep_Siege"
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 50
	}
	public get RingRadius(): number {
		return 60
	}
	public get Position(): Vector3 {
		if (this.IsVisible || (this.PredictedIsWaitingToSpawn && this.IsWaitingToSpawn))
			return super.Position
		return this.PredictedPosition
	}
	public GetAdditionalAttackDamage(source: Unit): number {
		let damage = 0
		if (this.IsEnemy(source)) {
			const quellingBlade = source.GetItemByName("item_quelling_blade")
			if (quellingBlade !== undefined)
				damage += quellingBlade.GetSpecialValue(source.IsMelee ? "damage_bonus" : "damage_bonus_ranged")
		}
		return damage
	}
	public GetAdditionalAttackDamageMultiplier(source: Unit): number {
		let multiplier = 1
		if (this.IsEnemy(source)) {
			const battleFury = source.GetItemByName("item_bfury")
			if (battleFury !== undefined)
				multiplier *= battleFury.GetSpecialValue(source.IsMelee ? "quelling_bonus" : "quelling_bonus_ranged")
		}
		return multiplier
	}
	public TryAssignLane(): void {
		if (this.Lane !== MapArea.Unknown)
			return
		const area = DotaMap.GetMapArea(this.Position, true)
		switch (area[0]) {
			case MapArea.Top:
			case MapArea.Bottom:
			case MapArea.Middle:
				this.Lane = area[0]
				break
			default:
				break
		}
	}
}
export const Creeps = EntityManager.GetEntitiesByClass(Creep)

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof Creep) {
		ent.TryAssignLane()
		ent.PredictedPosition.CopyFrom(ent.NetworkedPosition)
	}
})
EventsSDK.on("Tick", dt => {
	const wave_time = ((GameRules?.GameTime ?? 0) % 30)
	const spawn_creeps = wave_time >= 0 && wave_time < (1 / 3)
	Creeps.forEach(creep => {
		creep.TryAssignLane()
		if (creep.PredictedIsWaitingToSpawn)
			creep.PredictedIsWaitingToSpawn = creep.IsWaitingToSpawn
		if (
			creep.Lane !== MapArea.Unknown
			&& creep.IsAlive
			&& !creep.IsVisible
		) {
			if (spawn_creeps)
				creep.PredictedIsWaitingToSpawn = false
			else if (!creep.IsSpawned && creep.PredictedIsWaitingToSpawn)
				return
			const next_pos = DotaMap.GetCreepCurrentTarget(creep.Position, creep.Team, creep.Lane)?.Position
			if (next_pos === undefined)
				return
			creep.PredictedPosition
				.Extend(next_pos, creep.IdealSpeed * dt)
				.CopyTo(creep.PredictedPosition)
			creep.PredictedPosition.SetZ(GetPositionHeight(creep.PredictedPosition))
		} else
			creep.PredictedPosition.CopyFrom(creep.NetworkedPosition)
	})
})
