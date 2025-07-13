import { Vector2 } from "../../Base/Vector2"
import { EventPriority } from "../../Enums/EventPriority"
import { MapArea } from "../../Enums/MapArea"
import { Team } from "../../Enums/Team"
import { GetCreepCurrentTarget } from "../../Helpers/DotaMap"
import { GetPositionHeight } from "../../Native/WASM"
import { Creep, Creeps } from "../../Objects/Base/Creep"
import { Entity, GameRules } from "../../Objects/Base/Entity"
import { GameState } from "../../Utils/GameState"
import { EventsSDK } from "../EventsSDK"

new (class CCreepWaveChanged {
	private lastUpdate = 0
	private readonly creeps: Creep[] = []

	constructor() {
		EventsSDK.on(
			"PostDataUpdate",
			this.PostDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PreEntityCreated",
			this.PreEntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"LifeStateChanged",
			this.LifeStateChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityVisibleChanged",
			this.EntityVisibleChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on("EntityDestroyed", this.EntityDestroyed.bind(this))
		EventsSDK.on("Draw", this.Draw.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on("GameEnded", this.GameEnded.bind(this), EventPriority.IMMEDIATE)
	}
	private get drawDelta() {
		return Math.min((hrtime() - this.lastUpdate) / 1000, GameState.TickInterval)
	}
	protected Draw() {
		if (GameRules?.IsPaused) {
			this.lastUpdate = hrtime()
		}
		for (let i = this.creeps.length - 1; i > -1; i--) {
			const creep = this.creeps[i]
			const nextPos = GetCreepCurrentTarget(
				creep.Position,
				creep.Team,
				creep.Lane
			)?.Position
			if (nextPos === undefined) {
				continue
			}
			const dist2D = creep.PredictedPosition.Distance2D(nextPos)
			creep.PredictedPosition.Extend2D(
				nextPos,
				Math.min(creep.MoveSpeed * this.drawDelta, dist2D)
			).CopyTo(creep.VisualPredictedPosition)
		}
	}
	protected PostDataUpdate(dt: number) {
		if (GameRules === undefined || dt === 0) {
			return
		}
		const localTeam = GameState.LocalTeam
		if (localTeam !== Team.Dire && localTeam !== Team.Radiant) {
			return
		}
		const curTime = hrtime()
		const deltaTime = (curTime - this.lastUpdate) / 1000
		this.lastUpdate = curTime

		const waveTime = GameRules.GameTime % 30
		for (let i = Creeps.length - 1; i > -1; i--) {
			const creep = Creeps[i]
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
				this.creeps.remove(creep)
				continue
			}
			if (waveTime >= 0 && waveTime < dt) {
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
					Math.min(creep.MoveSpeed * deltaTime, dist2D)
				)
				creep.PredictedPosition.SetX(newPos.x)
					.SetY(newPos.y)
					.SetZ(GetPositionHeight(newPos))
				const find = this.creeps.find(x => x === creep)
				if (find === undefined) {
					this.creeps.push(creep)
				}
			}
			creep.LastPredictedPositionUpdate = GameState.RawGameTime
		}
	}
	protected PreEntityCreated(entity: Entity) {
		if (entity instanceof Creep) {
			entity.TryAssignLane()
		}
	}
	protected EntityDestroyed(entity: Entity) {
		if (entity instanceof Creep) {
			this.creeps.remove(entity)
		}
	}
	protected LifeStateChanged(entity: Entity) {
		if (entity instanceof Creep) {
			this.creeps.remove(entity)
		}
	}
	protected EntityVisibleChanged(entity: Entity) {
		if (entity instanceof Creep) {
			this.creeps.remove(entity)
		}
	}
	protected GameEnded() {
		this.lastUpdate = 0
		this.creeps.clear()
	}
})()
