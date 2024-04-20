import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { Team } from "../../Enums/Team"
import { GUIInfo } from "../../GUI/GUIInfo"
import { GetCreepCurrentTarget, GetMapArea } from "../../Helpers/DotaMap"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { GameState } from "../../Utils/GameState"
import { GameRules } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Creep")
export class Creep extends Unit {
	public Lane = MapArea.Unknown
	public PredictedIsWaitingToSpawn = true

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsCreep = true
	}

	public get IsEidolon() {
		return this.Name.endsWith("_lesser_eidolon")
	}

	public get IsLaneCreep() {
		return (
			this.ClassName === "CDOTA_BaseNPC_Creep_Lane" ||
			this.ClassName === "CDOTA_BaseNPC_Creep_Siege"
		)
	}

	public get IsNeutral() {
		return super.IsNeutral || this.ClassName === "CDOTA_BaseNPC_Creep_Neutral"
	}

	public get IsSuperCreep() {
		return this.Name.endsWith("_upgraded")
	}

	public get IsMegaCreep() {
		return this.Name.endsWith("_upgraded_mega")
	}

	public get IsDeniable(): boolean {
		return this.HPPercent <= 50 || super.IsDeniable
	}
	public get RingRadius(): number {
		return 60
	}
	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(80), GUIInfo.ScaleHeight(5))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(11))
	}
	public TryAssignLane(): void {
		if (this.IsNeutral || this.Owner !== undefined || this.Lane !== MapArea.Unknown) {
			return
		}
		const area = GetMapArea(this.Position, true)
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
	}
})

EventsSDK.on("Tick", dt => {
	if (GameRules === undefined) {
		return
	}
	const localTeam = GameState.LocalTeam
	if (localTeam !== Team.Dire && localTeam !== Team.Radiant) {
		return
	}
	const moduleGameTime = GameRules.GameTime % 30
	const waveTime = Math.floor(Math.abs(moduleGameTime).toNumberFixed(1))

	for (let index = Creeps.length - 1; index > -1; index--) {
		const creep = Creeps[index]
		if (creep.IsNeutral || creep.Owner !== undefined) {
			creep.Lane = MapArea.Unknown
			continue
		}
		creep.TryAssignLane()
		if (
			// we should handle all those cases except creep.Lane in Unit
			creep.Lane === MapArea.Unknown ||
			!creep.IsAlive ||
			creep.IsVisible
		) {
			continue
		}

		if (waveTime <= 0) {
			creep.PredictedIsWaitingToSpawn = false
		} else if (!creep.IsSpawned && creep.PredictedIsWaitingToSpawn) {
			continue
		}

		const nextPos = GetCreepCurrentTarget(
			creep.Position,
			creep.Team,
			creep.Lane
		)?.Position

		if (nextPos === undefined) {
			continue
		}

		const dist2D = creep.PredictedPosition.Distance2D(nextPos)
		if (dist2D > 0.01) {
			const newPos = Vector2.FromVector3(creep.PredictedPosition).Extend(
				Vector2.FromVector3(nextPos),
				Math.min(creep.Speed * dt, dist2D)
			)
			creep.PredictedPosition.SetX(newPos.x)
				.SetY(newPos.y)
				.SetZ(GetPositionHeight(newPos))
		}
		creep.LastPredictedPositionUpdate = GameState.RawGameTime
	}
})
