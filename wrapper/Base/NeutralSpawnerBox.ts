import { Color } from "../Base/Color"
import { NeutralSpawnBox } from "../Base/NeutralSpawnBox"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { NeutralSpawnerType } from "../Enums/NeutralSpawnerType"
import { GameSleeper } from "../Helpers/Sleeper"
import { ParticlesSDK } from "../Managers/ParticleManager"
import { ProjectileManager } from "../Managers/ProjectileManager"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Creep } from "../Objects/Base/Creep"
import { GameRules, LocalPlayer } from "../Objects/Base/Entity"
import { NeutralSpawner } from "../Objects/Base/NeutralSpawner"
import { Unit } from "../Objects/Base/Unit"
import { WardObserver } from "../Objects/Base/WardObserver"
import { WardTrueSight } from "../Objects/Base/WardTrueSight"
import { GameState } from "../Utils/GameState"

export const NeutralSpawners: NeutralSpawnerBox[] = []
export class NeutralSpawnerBox {
	public static readonly Sleeper = new GameSleeper()

	public static get TimeLeft() {
		return Math.floor(((GameRules?.GameTime ?? 0) % this.SpawnInterval) * 10) / 10
	}
	public static get RemainingTime() {
		const remaining = this.SpawnInterval - this.TimeLeft
		return Math.floor(remaining * 10) / 10
	}
	protected static get SpawnInterval() {
		return ConVarsSDK.GetFloat("dota_neutral_spawn_interval", 60)
	}
	protected get IsValidGame() {
		if (GameRules === undefined || GameRules.GameTime < 61) {
			return false
		}
		return GameRules.GameState === DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
	}
	protected static get IsSpawnTime() {
		return !(this.TimeLeft > 0)
	}

	public readonly Creeps: Creep[] = []
	public readonly Attackers: Unit[] = []
	public readonly Type: NeutralSpawnerType

	public Hits = 0
	public IsEmpty = false
	public IsStack = false
	public LastAttackTime = 0
	public TotalCreepAvgGold = 0

	protected IsInitialSpawn = true
	protected IsStackMoveAttack = false

	constructor(public readonly Spawner: NeutralSpawner) {
		this.Type = Spawner.Type
	}
	public get IsValidSpawner() {
		if (!this.IsValidGame) {
			return false
		}
		if (this.Creeps.length === 0) {
			return this.IsInitialSpawn
		}
		return true
	}
	public get Team() {
		return this.Spawner.SpawnerTeam
	}
	public get IsAlly() {
		return this.Team === GameState.LocalTeam
	}
	public get Position() {
		return this.Spawner.Position
	}
	public get EndPosition() {
		switch (this.Type) {
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
	public get StackStartTime() {
		return this.Spawner.SpawnBox?.StackStart ?? 0
	}
	public get ValidCreeps() {
		return this.Creeps.filter(x => x.IsAlive && x.IsSpawned)
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
		if (this.IsStack || NeutralSpawnerBox.Sleeper.Sleeping(unit.Index)) {
			return false
		}
		return unit.CanMove()
	}
	public Stack(unit: Unit, creeps: Creep[], endPosition: Vector3) {
		if (!unit.CanAttack() || !unit.CanMove()) {
			return false
		}
		if (
			unit.Distance2D(endPosition) <= 100 ||
			NeutralSpawnerBox.Sleeper.Sleeping(unit.Index)
		) {
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
		const delay = (unit.Distance2D(endPosition) / unit.MoveSpeed) * 1000
		NeutralSpawnerBox.Sleeper.Sleep(delay, unit.Index)
		return true
	}
	public PostDataUpdate() {
		const creeps = this.ValidCreeps,
			time = NeutralSpawnerBox.TimeLeft,
			box = this.Spawner.SpawnBox
		if (time >= this.StackEndTime || this.Hits >= 5) {
			this.IsEmpty =
				!creeps.some(
					x => x.IsAlive && x.IsSpawned && this.includes2D(box, x.Position)
				) && creeps.length < 2
		}
		if (
			NeutralSpawnerBox.IsSpawnTime &&
			this.LastAttackTime + 7 < GameState.RawGameTime
		) {
			this.reset()
			this.Creeps.orderByDescending(x => !x.IsWaitingToSpawn)
			this.calculateAndSortCreepGold()
		}
	}
	public EntityPositionChanged(entity: Unit) {
		const time = NeutralSpawnerBox.TimeLeft,
			box = this.Spawner.SpawnBox
		if (entity instanceof WardTrueSight || entity instanceof WardObserver) {
			this.IsEmpty =
				this.includes2D(box, entity.Position) && this.ValidCreeps.length < 2
			return
		}
		if (
			!this.IsStack &&
			((time >= this.StackEndTime && this.checkPosition(entity)) ||
				entity.Distance2D(this.Position) <= 85)
		) {
			this.IsEmpty = true
		}
	}
	public UnitPropertyChanged(_entity: Creep) {
		this.calculateAndSortCreepGold()
	}
	public EntityCreated(entity: Creep) {
		if (this.Creeps.some(x => x === entity)) {
			return
		}
		this.Creeps.push(entity)
		this.calculateAndSortCreepGold()
	}
	public EntityDestroyed(entity: NeutralSpawner | Unit) {
		if (entity instanceof Creep) {
			this.Creeps.remove(entity)
			this.calculateAndSortCreepGold()
		}
		if (entity instanceof Unit) {
			this.Attackers.remove(entity)
		}
		if (entity instanceof NeutralSpawner) {
			this.Creeps.clear()
			this.TotalCreepAvgGold = 0
			this.Attackers.clear()
			NeutralSpawners.remove(this)
		}
	}
	public LifeStateChanged(unit: Creep) {
		this.Creeps.remove(unit)
		this.calculateAndSortCreepGold()
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
			Hits: ${this.Hits}
			Type: ${this.SpawnerTypeString}
			IsEmpty: ${this.IsEmpty}
			IsStack: ${this.IsStack}
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
		if (!this.Attackers.some(x => x === unit)) {
			this.Attackers.push(unit)
		}
		++this.Hits
		this.LastAttackTime = GameState.RawGameTime
	}
	private reset() {
		this.Hits = 0
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
		return (
			(!attacker.IsVisible &&
				attacker.Distance2D(this.Position) <=
					attacker.GetAttackRange(undefined, 100)) ||
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
	private includes2D(box: Nullable<NeutralSpawnBox>, vec: Vector3): boolean {
		return box?.Includes2D(Vector2.FromVector3(vec)) ?? false
	}
	private calculateAndSortCreepGold() {
		this.Creeps.orderByDescending(x => !x.IsWaitingToSpawn)
		this.TotalCreepAvgGold = this.Creeps.reduce(
			(prev, curr) =>
				prev +
				(curr.IsWaitingToSpawn
					? 0
					: Math.round((curr.GoldBountyMin + curr.GoldBountyMax) / 2)),
			0
		)
	}
}
