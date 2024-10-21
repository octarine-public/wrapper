import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { EventPriority } from "../Enums/EventPriority"
import { NeutralSpawnerType } from "../Enums/NeutralSpawnerType"
import { Team } from "../Enums/Team"
import { GameSleeper } from "../Helpers/Sleeper"
import { RendererSDK } from "../Native/RendererSDK"
import { Creep, Creeps } from "../Objects/Base/Creep"
import { Entity, GameRules, LocalPlayer } from "../Objects/Base/Entity"
import { NeutralSpawner } from "../Objects/Base/NeutralSpawner"
import { Unit } from "../Objects/Base/Unit"
import { WardObserver } from "../Objects/Base/WardObserver"
import { WardTrueSight } from "../Objects/Base/WardTrueSight"
import { GameState } from "../Utils/GameState"
import { EventsSDK } from "./EventsSDK"
import { ParticlesSDK } from "./ParticleManager"
import { ProjectileManager } from "./ProjectileManager"

export const NeutralSpawners: NeutralSpawnerBox[] = []

export class NeutralSpawnerBox {
	public readonly Creeps: Creep[] = []
	public readonly Attackers: Unit[] = []
	public readonly Type: NeutralSpawnerType

	public MaxHits = 0
	public IsStack = false
	public IsEmpty = false
	public LastAttackTime = 0

	protected IsInitialSpawn = true
	protected IsStackMoveAttack = false
	protected readonly Sleeper = new GameSleeper()

	constructor(public readonly Spawner: NeutralSpawner) {
		this.Type = Spawner.Type
	}

	public get IsAlly() {
		return (this.Spawner.SpawnerTeam ?? Team.Invalid) === GameState.LocalTeam
	}

	public get Position() {
		return this.Spawner.Position
	}

	public get EndPosition() {
		switch (this.Spawner.Type) {
			case NeutralSpawnerType.Large:
				return this.Spawner.InFront(1400)
			case NeutralSpawnerType.Ancient:
				return this.Spawner.InFront(1700)
			default:
				return this.Spawner.InFront(1300)
		}
	}

	public get StackEndTime() {
		return this.Spawner.SpawnBox?.StackEnd ?? 0
	}

	public get Team() {
		return this.Spawner.SpawnerTeam
	}

	public get StackStartTime() {
		return this.Spawner.SpawnBox?.StackStart ?? 0
	}

	public get IsValidSpawner() {
		if (!this.IsValidGame) {
			return false
		}
		if (!this.Creeps.length) {
			return this.IsInitialSpawn
		}
		return true
	}

	public get IsValidGame() {
		if (GameRules === undefined || GameRules.GameTime < 61) {
			return false
		}
		return GameRules.GameState === DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
	}

	protected get TimeLeft() {
		if (GameRules === undefined) {
			return 0
		}
		return parseFloat((GameRules.GameTime % 60).toFixed(1))
	}

	protected get IsSpawnTime() {
		return !(this.TimeLeft > 0)
	}

	protected get SpawnerTypeString() {
		switch (this.Type) {
			case NeutralSpawnerType.Small:
				return "Small"
			case NeutralSpawnerType.Medium:
				return "Medium"
			case NeutralSpawnerType.Large:
				return "Large"
			case NeutralSpawnerType.Ancient:
				return "Ancient"
			default:
				return "Unknown"
		}
	}

	public CanBeStack(unit: Unit) {
		return unit.CanMove() && !this.IsStack && !this.Sleeper.Sleeping(unit.Index)
	}

	public Stack(unit: Unit, creeps: Creep[], endPosition: Vector3) {
		if (!unit.CanAttack() || !unit.CanMove()) {
			return false
		}
		if (unit.Distance2D(endPosition) <= 100 || this.Sleeper.Sleeping(unit.Index)) {
			this.attackMovePosition(unit, endPosition)
			return true
		}

		if (!this.IsStack) {
			this.IsStack =
				this.isProjectileAttack(unit, creeps) ||
				creeps.some(x => x.Target === unit)
			return true
		}

		unit.MoveTo(endPosition)
		const delay = (unit.Distance2D(endPosition) / unit.Speed) * 1000
		this.Sleeper.Sleep(delay, unit.Index)
		return true
	}

	public PostDataUpdate(units: Unit[]) {
		this.UpdateSpawnerByTime()

		if (GameRules === undefined || this.IsEmpty) {
			return
		}

		const time = this.TimeLeft,
			creeps = this.Creeps.filter(x => x.IsAlive && x.IsSpawned)

		if (time >= this.StackEndTime || this.MaxHits >= 5) {
			const box = this.Spawner.SpawnBox
			this.IsEmpty =
				!creeps.some(x => box?.Includes2D(Vector2.FromVector3(x.Position))) &&
				creeps.length < 2
		}

		for (let index = units.length - 1; index > -1; index--) {
			const unit = units[index]
			if (!unit.IsAlive) {
				continue
			}
			if (unit instanceof WardTrueSight || unit instanceof WardObserver) {
				const box = this.Spawner.SpawnBox
				this.IsEmpty =
					(box?.Includes2D(Vector2.FromVector3(unit.Position)) ?? false) &&
					this.Creeps.filter(x => x.IsAlive && x.IsSpawned).length < 2
				continue
			}
			if (!this.IsStack && time >= this.StackEndTime && this.checkPosition(unit)) {
				this.IsEmpty = true
				break
			}
		}
	}

	public EntityCreated(entity: Creep) {
		if (!this.Creeps.includes(entity)) {
			this.Creeps.push(entity)
		}
	}

	public EntityDestroyed(entity: NeutralSpawner | Unit) {
		if (entity instanceof Creep) {
			this.Creeps.remove(entity)
		}
		if (entity instanceof Unit) {
			this.Attackers.remove(entity)
		}
		if (entity instanceof NeutralSpawner) {
			this.Creeps.clear()
			this.Attackers.clear()
			this.Sleeper.FullReset()
			NeutralSpawners.remove(this)
		}
	}

	public LifeStateChanged(unit: Unit) {
		if (unit instanceof Creep) {
			this.Creeps.remove(unit)
		}
		if (unit instanceof Unit) {
			this.Attackers.remove(unit)
		}
	}

	public DrawDebug(pSDK: ParticlesSDK) {
		if (LocalPlayer === undefined || LocalPlayer.Hero === undefined) {
			return
		}

		const spawner = this.Spawner
		const w2s = RendererSDK.WorldToScreen(this.Position)
		if (w2s === undefined) {
			return
		}

		RendererSDK.Text(
			`Name: ${spawner.Name}
			Type: ${this.SpawnerTypeString}
			IsEmpty: ${this.IsEmpty}
			IsStack: ${this.IsStack}
			MaxHits: ${this.MaxHits}
			Creeps count: ${this.Creeps.length}
			Attackers count: ${this.Attackers.length}`,
			w2s,
			Color.White,
			RendererSDK.DefaultFontName,
			11
		)

		pSDK.DrawCircle(spawner.Name + "radius", LocalPlayer.Hero, 50, {
			Position: this.Position
		})

		pSDK.DrawLine(spawner.Name + "line", LocalPlayer.Hero, this.EndPosition, {
			Position: this.Position,
			Width: 50
		})
	}

	public AttackStarted(unit: Unit) {
		if (!this.Attackers.includes(unit)) {
			this.Attackers.push(unit)
		}
		this.MaxHits++
		this.LastAttackTime = GameState.RawGameTime
	}

	protected UpdateSpawnerByTime() {
		if (this.IsSpawnTime && this.LastAttackTime + 7 < GameState.RawGameTime) {
			this.setEmpty()
		}
	}

	private setEmpty() {
		this.MaxHits = 0
		this.IsEmpty = false
		this.IsStack = false
		this.LastAttackTime = 0
		this.Attackers.clear()
		this.IsStackMoveAttack = false
	}

	private checkPosition(attacker: Unit) {
		const box = this.Spawner.SpawnBox
		if (box === undefined) {
			return true
		}
		const distance = attacker.Distance2D(this.Position)
		const attackRange = attacker.GetAttackRange(undefined, 100)
		return (
			(!attacker.IsVisible && distance <= attackRange) ||
			box.Includes2D(Vector2.FromVector3(attacker.Position))
		)
	}

	private isProjectileAttack(unit: Unit, creeps: Creep[]) {
		return (
			unit.IsRanged &&
			ProjectileManager.AllTrackingProjectiles.some(
				x =>
					x.IsAttack &&
					x.Source === unit &&
					creeps.some(creep => creep === x.Target)
			)
		)
	}

	private attackMovePosition(unit: Unit, position: Vector3) {
		if (this.IsStackMoveAttack || unit.Distance2D(position) > 101) {
			return
		}
		unit.AttackMove(position)
		this.IsStackMoveAttack = true
	}
}

const Monitor = new (class CCampManager {
	private readonly pSDK = new ParticlesSDK()
	private readonly units: Unit[] = []

	public Draw() {
		if (!GameState.IsConnected) {
			return
		}
		const global = globalThis as any
		if (!(global?.DEBUG ?? false) || !(global?.DEBUGGER_INSTALLED ?? false)) {
			return
		}
		for (let index = NeutralSpawners.length - 1; index > -1; index--) {
			NeutralSpawners[index].DrawDebug(this.pSDK)
		}
	}

	public PostDataUpdate() {
		if (!GameState.IsConnected) {
			return
		}
		for (let index = NeutralSpawners.length - 1; index > -1; index--) {
			NeutralSpawners[index].PostDataUpdate(this.units)
		}
	}

	public EntityCreated(entity: Entity) {
		if (entity instanceof NeutralSpawner) {
			NeutralSpawners.push(new NeutralSpawnerBox(entity))
			this.RestartCreeps()
		}
		if (entity instanceof Unit && this.ShouldUnit(entity)) {
			this.units.push(entity)
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.GetSpawnerBySpawner(entity.Spawner)?.EntityCreated(entity)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof NeutralSpawner) {
			this.GetSpawnerBySpawner(entity)?.EntityDestroyed(entity)
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.GetSpawnerBySpawner(entity.Spawner)?.EntityDestroyed(entity)
		}
		if (entity instanceof Unit && this.ShouldUnit(entity)) {
			this.units.remove(entity)
		}
	}

	public LifeStateChanged(entity: Entity) {
		if (entity.IsAlive) {
			return
		}
		if (entity instanceof Unit && this.ShouldUnit(entity)) {
			this.units.remove(entity)
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.GetSpawnerBySpawner(entity.Spawner)?.LifeStateChanged(entity)
		}
	}

	public AttackStarted(unit: Unit) {
		if (!unit.IsHero && !unit.IsSpiritBear) {
			return
		}
		const spawner = NeutralSpawners.find(
			x =>
				!x.IsEmpty &&
				(x.Spawner.SpawnBox?.Includes(unit.Position) ||
					unit.Distance2D(x.Spawner.Position) <= 600)
		)
		if (spawner !== undefined) {
			spawner.AttackStarted(unit)
		}
	}

	protected GetSpawnerByName(name: string) {
		return NeutralSpawners.find(x => x.Spawner.Name === name)
	}

	protected GetSpawnerBySpawner(spawner: Nullable<NeutralSpawner>) {
		return NeutralSpawners.find(x => x.Spawner === spawner)
	}

	protected RestartCreeps() {
		for (let index = Creeps.length - 1; index > -1; index--) {
			const creep = Creeps[index]
			if (!creep.IsNeutral) {
				continue
			}
			this.GetSpawnerBySpawner(creep.Spawner)?.EntityCreated(creep)
		}
	}

	protected ShouldUnit(unit: Unit) {
		if (unit.IsBuilding) {
			return false
		}
		if (unit instanceof Creep && unit.IsNeutral) {
			return false
		}
		return (
			unit.IsHero ||
			unit.IsCreep ||
			unit.IsSpiritBear ||
			unit instanceof WardObserver ||
			unit instanceof WardTrueSight
		)
	}
})()

EventsSDK.on("Draw", () => Monitor.Draw())

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate())

EventsSDK.on("EntityCreated", ent => Monitor.EntityCreated(ent), EventPriority.IMMEDIATE)

EventsSDK.on(
	"AttackStarted",
	unit => Monitor.AttackStarted(unit),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"LifeStateChanged",
	entity => Monitor.LifeStateChanged(entity),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"EntityDestroyed",
	ent => Monitor.EntityDestroyed(ent),
	EventPriority.IMMEDIATE
)
