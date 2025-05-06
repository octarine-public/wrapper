import { NeutralSpawnerBox, NeutralSpawners } from "../../Base/NeutralSpawnerBox"
import { EventPriority } from "../../Enums/EventPriority"
import { Creep, Creeps } from "../../Objects/Base/Creep"
import { Entity } from "../../Objects/Base/Entity"
import { NeutralSpawner } from "../../Objects/Base/NeutralSpawner"
import { Unit } from "../../Objects/Base/Unit"
import { WardObserver } from "../../Objects/Base/WardObserver"
import { WardTrueSight } from "../../Objects/Base/WardTrueSight"
import { GameState } from "../../Utils/GameState"
import { EventsSDK } from "../EventsSDK"
import { ParticlesSDK } from "../ParticleManager"

new (class CNeutralSpawnerBoxChanged {
	// only for debug
	private readonly pSDK = new ParticlesSDK()

	constructor() {
		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("GameEnded", this.GameChanged.bind(this))
		EventsSDK.on("GameStarted", this.GameChanged.bind(this))
		EventsSDK.on("PostDataUpdate", this.PostDataUpdate.bind(this))
		EventsSDK.on("EntityPositionChanged", this.EntityPositionChanged.bind(this))
		EventsSDK.on(
			"EntityCreated",
			this.EntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"AttackStarted",
			this.AttackStarted.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"LifeStateChanged",
			this.LifeStateChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityDestroyed",
			this.EntityDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	private get isDebug() {
		return (
			((globalThis as any)?.DEBUG ?? false) &&
			((globalThis as any)?.DEBUGGER_INSTALLED ?? false)
		)
	}
	protected Draw() {
		if (!GameState.IsConnected || !this.isDebug) {
			return
		}
		for (let i = NeutralSpawners.length - 1; i > -1; i--) {
			NeutralSpawners[i].DrawDebug(this.pSDK)
		}
	}
	protected EntityPositionChanged(entity: Entity) {
		if (!(entity instanceof Unit) || !this.ShouldUnit(entity)) {
			return
		}
		for (let i = NeutralSpawners.length - 1; i > -1; i--) {
			NeutralSpawners[i].EntityPositionChanged(entity)
		}
	}
	protected PostDataUpdate(_delta: number) {
		if (!GameState.IsConnected) {
			return
		}
		for (let i = NeutralSpawners.length - 1; i > -1; i--) {
			NeutralSpawners[i].PostDataUpdate()
		}
	}
	protected EntityCreated(entity: Entity) {
		if (entity instanceof Unit) {
			this.EntityPositionChanged(entity)
		}
		if (entity instanceof NeutralSpawner) {
			NeutralSpawners.push(new NeutralSpawnerBox(entity))
			this.RestartCreeps()
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.FindNeutralSpawner(entity.Spawner)?.EntityCreated(entity)
		}
	}
	protected EntityDestroyed(entity: Entity) {
		if (entity instanceof NeutralSpawner) {
			this.FindNeutralSpawner(entity)?.EntityDestroyed(entity)
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.FindNeutralSpawner(entity.Spawner)?.EntityDestroyed(entity)
		}
	}
	protected LifeStateChanged(entity: Entity) {
		if (entity instanceof Unit) {
			this.EntityPositionChanged(entity)
		}
		if (entity.IsAlive) {
			return
		}
		if (entity instanceof Creep && entity.IsNeutral) {
			this.FindNeutralSpawner(entity.Spawner)?.LifeStateChanged(entity)
		}
	}
	protected AttackStarted(unit: Unit) {
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
	protected GameChanged() {
		NeutralSpawnerBox.Sleeper.FullReset()
	}
	protected GetSpawnerByName(name: string) {
		return NeutralSpawners.find(x => x.Spawner.Name === name)
	}
	protected FindNeutralSpawner(spawner: Nullable<NeutralSpawner>) {
		return NeutralSpawners.find(x => x.Spawner === spawner)
	}
	protected RestartCreeps() {
		for (let index = Creeps.length - 1; index > -1; index--) {
			const creep = Creeps[index]
			if (!creep.IsNeutral) {
				continue
			}
			this.FindNeutralSpawner(creep.Spawner)?.EntityCreated(creep)
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
