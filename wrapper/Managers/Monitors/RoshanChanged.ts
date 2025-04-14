import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { EventPriority } from "../../Enums/EventPriority"
import { ConVarsSDK } from "../../Native/ConVarsSDK"
import { Entity, GameRules } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { RoshanSpawner } from "../../Objects/Base/RoshanSpawner"
import { Unit } from "../../Objects/Base/Unit"
import { Roshan } from "../../Objects/Units/Roshan"
import { GameState } from "../../Utils/GameState"
import { EventsSDK } from "../EventsSDK"

class MovePrediction {
	public IsAlive = false
	private positions: Vector3[] = []
	private position = new Vector3().Invalidate()
	private lastLocation: ERoshanLocation | -1 | 2 = -1 // middle(2), invalidate(-1)
	private readonly staticBotAngles = new QAngle(0, 135)
	private readonly staticTopAngles = new QAngle(0, 320.625)
	private readonly staticMidPosition = new Vector3(-491.53125, -393.4375, 0)

	public PostDataUpdate(delta: number) {
		this.Update() // update angles/positions
		this.predictPosition(delta) // update predicticted position
	}
	public Update() {
		const spawner = Roshan.Spawner,
			roshan = Roshan.Instance
		if (spawner === undefined) {
			return
		}
		const angles = this.getAngles(spawner)
		if (roshan === undefined) {
			this.setAngles(angles, spawner, spawner.IsMovingRoshan)
			this.setPositions(spawner)
			return
		}
		if (roshan instanceof Roshan || roshan instanceof FakeUnit) {
			roshan.PredictionMoveSpeed = Roshan.MoveSpeed
			this.setAngles(angles, roshan, spawner.IsMovingRoshan)
			this.setPositions(spawner)
		}
	}
	private predictPosition(delta: number) {
		const spawner = Roshan.Spawner,
			roshan = Roshan.Instance
		if (spawner === undefined) {
			return
		}
		const position = this.getPosition(spawner)
		if (!this.IsAlive) {
			this.setBasePosition(spawner, position, roshan)
			return
		}
		const tick = GameState.TickInterval
		if (RoshanSpawner.TimeUntilNextMove <= tick) {
			spawner.IsMovingRoshan = true
		}
		if (!this.position.IsValid) {
			this.setBasePosition(spawner, position, roshan)
		}
		if (this.lastLocation === -1 && RoshanSpawner.TimeUntilNextMove <= 10) {
			this.lastLocation = 2 // middle
			this.position.CopyFrom(position)
		}
		if (!spawner.IsMovingRoshan || this.lastLocation === -1) {
			return
		}
		const nextPosition = this.positions[this.lastLocation]
		if (this.position.Distance2D(nextPosition) < 250) {
			this.lastLocation = spawner.LocationType
		}
		if (roshan instanceof Roshan && roshan.IsVisible) {
			roshan.VisualPosition.CopyTo(this.position)
		} else {
			this.position
				.Extend2D(nextPosition, Roshan.MoveSpeed * delta)
				.CopyTo(this.position)
		}
		if (roshan !== undefined) {
			roshan.PredictedPosition.CopyFrom(this.position)
			roshan.LastPredictedPositionUpdate = GameState.RawGameTime
			roshan.LastRealPredictedPositionUpdate = GameState.RawGameTime
		}
		spawner.RoshanPrediction.CopyFrom(this.position)
		if (this.position.Distance2D(position) < 10) {
			this.lastLocation = -1
			spawner.IsMovingRoshan = false
			spawner.RoshanPrediction.CopyFrom(position)
			roshan?.PredictedPosition.CopyFrom(position)
		}
	}
	private getAngles(spawner: RoshanSpawner) {
		return spawner.LocationType === ERoshanLocation.BOT
			? this.staticBotAngles
			: this.staticTopAngles
	}
	private setAngles(
		angles: QAngle,
		entity: Unit | RoshanSpawner | FakeUnit,
		isMovingRoshan = false
	) {
		let reverse = new QAngle()
		if (isMovingRoshan && Roshan.Spawner !== undefined) {
			const isBot = Roshan.Spawner.LocationType === ERoshanLocation.BOT
			reverse = isBot ? this.staticTopAngles : this.staticBotAngles
		}
		if (entity instanceof RoshanSpawner) {
			Roshan.StaticAngles.CopyFrom(reverse.IsZero() ? angles : reverse)
			return
		}
		if (entity instanceof FakeUnit || entity instanceof Roshan) {
			entity.PredictionAngles.CopyFrom(reverse.IsZero() ? angles : reverse)
		}
	}
	private setPositions(spawner: RoshanSpawner) {
		this.positions = [
			spawner.TOPLocation,
			spawner.BOTLocation,
			this.staticMidPosition
		]
	}
	private getPosition(spawner: RoshanSpawner) {
		return spawner.LocationType === ERoshanLocation.BOT
			? spawner.BOTLocation
			: spawner.TOPLocation
	}
	private setBasePosition(
		spawner: RoshanSpawner,
		position: Vector3,
		roshan: Nullable<Unit | FakeUnit>
	) {
		spawner.IsMovingRoshan = false
		this.position.CopyFrom(position)
		spawner.RoshanPrediction.CopyFrom(position)
		roshan?.PredictedPosition.CopyFrom(position)
	}
}

new (class CRoshanChanged {
	private readonly prediction = new MovePrediction()
	private lastUpdateMinute = 0

	constructor() {
		EventsSDK.on("EntityDestroyed", this.EntityDestroyed.bind(this))
		EventsSDK.on("ChatEvent", this.ChatEvent.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on("GameEvent", this.GameEvent.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on("GameEnded", this.GameEnded.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on(
			"LifeStateChanged",
			this.LifeStateChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PostDataUpdate",
			this.PostDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ParticleCreated",
			this.ParticleCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PreEntityCreated",
			this.PreEntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	private get lastMinute() {
		const time = GameRules?.GameTime ?? 0,
			rate = ConVarsSDK.GetFloat("dota_roshan_upgrade_rate", 60)
		return Math.max(0, Math.floor(time / rate))
	}
	protected PostDataUpdate(dt: number) {
		if (dt === 0) {
			return
		}
		this.prediction.PostDataUpdate(dt)
		if (Roshan.HP === 0) {
			return
		}
		Roshan.HPRegenCounter += Roshan.HPRegen * Math.min(dt, 0.1)
		const regenAmountFloor = Math.floor(Roshan.HPRegenCounter)
		Roshan.HP =
			Roshan.Instance instanceof Entity && Roshan.Instance.IsVisible
				? Roshan.Instance.HP
				: Math.min(Roshan.HP + regenAmountFloor, Roshan.MaxHP)
		Roshan.HPRegenCounter -= regenAmountFloor
		const min = this.lastMinute
		if (min === this.lastUpdateMinute) {
			return
		}
		Roshan.MaxHP = Roshan.BaseHP + this.hpChangedByMinute(min)
		Roshan.HP *=
			Roshan.MaxHP / (Roshan.BaseHP + this.hpChangedByMinute(this.lastUpdateMinute))
		this.lastUpdateMinute = min
	}
	protected ParticleCreated(particle: NetworkedParticle) {
		if (particle.PathNoEcon !== "particles/neutral_fx/roshan_spawn.vpcf") {
			return
		}
		Roshan.Instance = particle.AttachedTo
		if (Roshan.Instance instanceof FakeUnit) {
			Roshan.Instance.Name = "npc_dota_roshan"
			Roshan.Instance.ModelName = "models/creeps/roshan/roshan.vmdl"
		}
		this.lastUpdateMinute = this.lastMinute
		Roshan.HP = Roshan.BaseHP + this.hpChangedByMinute(this.lastUpdateMinute)
		Roshan.MaxHP = Roshan.HP
		this.prediction.IsAlive = true
		this.prediction.Update()
	}
	protected GameEvent(name: string, obj: any) {
		if (name === "entity_killed") {
			if (Roshan.Instance?.HandleMatches(obj.entindex_killed)) {
				this.prediction.IsAlive = false
			}
		}
		if (name !== "entity_hurt") {
			return
		}
		if (Roshan.Instance?.HandleMatches(obj.entindex_killed)) {
			Roshan.HP = Math.max(Math.round(Roshan.HP - obj.damage), 0)
		}
	}
	public ChatEvent(msgType: DOTA_CHAT_MESSAGE) {
		if (msgType === DOTA_CHAT_MESSAGE.CHAT_MESSAGE_ROSHAN_KILL) {
			this.prediction.IsAlive = false
		}
	}
	protected LifeStateChanged(entity: Entity) {
		if (Roshan.Instance === entity) {
			this.prediction.IsAlive = entity.IsAlive
			Roshan.HP = 0
		}
	}
	protected PreEntityCreated(entity: Entity) {
		if (entity instanceof RoshanSpawner) {
			Roshan.Spawner = entity
			this.prediction.Update()
		}
		if (entity === GameRules && this.lastUpdateMinute === 0) {
			this.lastUpdateMinute = this.lastMinute
		}
		if (!(entity instanceof Roshan)) {
			return
		}
		if (Roshan.Instance instanceof Entity && Roshan.Instance !== entity) {
			return
		}
		Roshan.HP = entity.HP
		Roshan.Instance = entity
		Roshan.MaxHP = entity.MaxHP
		this.lastUpdateMinute = this.lastMinute
		this.prediction.IsAlive = true
		this.prediction.Update()
	}
	protected EntityDestroyed(entity: Entity) {
		if (Roshan.Instance === entity) {
			Roshan.HP = 0
			Roshan.MaxHP = 0
			Roshan.Instance = undefined
			this.prediction.IsAlive = false
		}
		if (entity instanceof RoshanSpawner) {
			Roshan.Spawner = undefined
		}
	}
	protected GameEnded() {
		Roshan.HP = 0
		Roshan.MaxHP = 0
		Roshan.HPRegenCounter = 0
		Roshan.Spawner = undefined
		Roshan.Instance = undefined
		this.lastUpdateMinute = 0
		this.prediction.IsAlive = false
	}
	private hpChangedByMinute(minute: number): number {
		let hpChanged = Roshan.HPChangedPerMinute
		if (GameRules?.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO) {
			hpChanged *= 2
		}
		return minute * hpChanged
	}
})()
