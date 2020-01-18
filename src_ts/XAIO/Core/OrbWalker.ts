import { Unit, dotaunitorder_t, Vector3, GameSleeper, Game, EventsSDK, Input } from "wrapper/Imports"
import { XAIOGame } from "./bootstrap"
let TurnEndTime = 0
let LastAttackTime = 0
let Sleep = new GameSleeper()
let GameData = new XAIOGame()

export let UnitsOrbWalker: Map<Unit, OrbWalker> = new Map()

class OrbWalker {
	public static readonly attackActivities: GameActivity_t[] = [
		GameActivity_t.ACT_DOTA_ATTACK,
		GameActivity_t.ACT_DOTA_ATTACK2,
		GameActivity_t.ACT_DOTA_ATTACK_EVENT
	]
	public static readonly attackCancelActivities: GameActivity_t[] = [
		GameActivity_t.ACT_DOTA_IDLE,
		GameActivity_t.ACT_DOTA_IDLE_RARE,
		GameActivity_t.ACT_DOTA_RUN
	]

	public static get PingTime() {
		return GameData.Ping / 2000
	}

	private get IsValidUnit() {
		return this.unit !== undefined
	}

	public OrbwalkingPoint = new Vector3()

	constructor(public unit: Unit) { }

	public Execute(target: Unit): boolean {
		if (!this.IsValidUnit)
			return false

		if (Sleep.Sleeping(this.unit))
			return false

		let time = Game.RawGameTime

		if (TurnEndTime > time)
			return false

		if (this.unit.IsChanneling || !this.unit.IsAlive || this.unit.IsStunned)
			return false

		if ((target !== undefined && this.CanAttack(target, time)) || !this.CanMove(time))
			return this.CanAttack(target, time) && this.Attack(target, time)

		if (!this.OrbwalkingPoint.IsZero())
			return this.Move(this.OrbwalkingPoint, time)

		return this.Move(Input.CursorOnWorld, time)
	}

	public Move(position: Vector3, time: number): boolean {
		if (!this.IsValidUnit)
			return false

		if (this.unit.IsMoving)
			return false

		this.unit.MoveTo(position)
		Sleep.Sleep(((GameData.Ping / 1000) + 200), this.unit)
		return true
	}

	public Attack(unit: Unit, time: number) {
		if (!this.IsValidUnit)
			return false

		TurnEndTime = this.GetTurnTime(unit, time)
		if (this.unit.CanAttack(unit)) {
			this.unit.AttackTarget(unit)
			Sleep.Sleep(((GameData.Ping / 1000) + 200), this.unit)
			return true
		}
		return false
	}

	public CanAttack(target: Unit, time: number) {
		if (!this.IsValidUnit)
			return false

		return this.unit.CanAttack && this.GetTurnTime(target, time) - LastAttackTime > 1 / this.unit.AttacksPerSecond
	}

	public GetTurnTime(unit: Unit, time: number): number {
		if (!this.IsValidUnit)
			return 0

		return time + OrbWalker.PingTime + this.unit.TurnTime(unit.Position) + 0.1 / 1000
	}

	public CanMove(time: number) {
		if (!this.IsValidUnit)
			return false

		return ((time - 0.1) + OrbWalker.PingTime) - LastAttackTime > this.unit.AttackPoint
	}
}

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	UnitsOrbWalker.set(ent, new OrbWalker(ent))
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit))
		return
	UnitsOrbWalker.delete(ent)
})

EventsSDK.on("GameEnded", () => {
	TurnEndTime = 0
	LastAttackTime = 0
	Sleep.FullReset()
})

EventsSDK.on("NetworkActivityChanged", unit => {
	let orbwalker = UnitsOrbWalker.get(unit)
	if (orbwalker === undefined)
		return

	let newNetworkActivity = unit.NetworkActivity
	if (!OrbWalker.attackActivities.includes(newNetworkActivity)) {
		if (OrbWalker.attackCancelActivities.includes(newNetworkActivity) && !orbwalker.CanMove(Game.RawGameTime + 0.05))
			LastAttackTime = 0
		return
	}
	LastAttackTime = Game.RawGameTime - OrbWalker.PingTime
})

EventsSDK.on("PrepareUnitOrders", args => {
	if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET)
		return

	let orbwalker = UnitsOrbWalker.get(args.Unit!)
	if (orbwalker === undefined)
		return

	let target = args.Target as Unit

	if (target === undefined || !target.IsValid)
		return

	if (orbwalker.CanMove(Game.RawGameTime))
		LastAttackTime = orbwalker.GetTurnTime(target, Game.RawGameTime) - OrbWalker.PingTime
})

