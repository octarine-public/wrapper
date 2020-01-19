import { Unit, dotaunitorder_t, GameSleeper, Game, EventsSDK, Input } from "wrapper/Imports"
import { XAIOGame } from "./bootstrap"
let Sleep = new GameSleeper()
let GameData = new XAIOGame()

export let UnitsOrbWalker: Map<Unit, OrbWalker> = new Map()

class OrbWalker {

	public TurnEndTime = 0
	public LastAttackTime = 0

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

	constructor(public unit: Unit) { }

	public GetTurnTime(target: Unit, time: number) {
		return time + (GameData.Ping / 2000) + this.unit.TurnTime(target.Position) + 0.2
	}

	public CanAttack(target: Unit, time: number) {
		return this.unit.CanAttack(target) && !this.unit.UnitState.some(x => x & 524288) && (this.GetTurnTime(target, time) - this.LastAttackTime) > (1 / this.unit.AttacksPerSecond)
	}

	public CanMove(time: number) {
		return (((time - 0.1) + (GameData.Ping / 2000)) - this.LastAttackTime) > this.unit.AttackPoint
	}

	public Execute(target: Unit, type: number) {

		let time = Game.RawGameTime

		if (this.TurnEndTime > time)
			return false

		if ((!target.IsValid || !this.CanAttack(target, time)) && this.CanMove(time) && !Sleep.Sleeping("sleep_move")) {
			this.unit.MoveTo(type === 0 ? target.InFront((GameData.Ping / 1000) + 200) : Input.CursorOnWorld)
			Sleep.Sleep((GameData.Ping / 1000) + 100, "sleep_move")
			return false
		}

		if (!this.CanAttack(target, time))
			return false

		this.TurnEndTime = this.GetTurnTime(target, time)
		this.LastAttackTime = this.TurnEndTime - (GameData.Ping / 2000)
		return true
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
	Sleep.FullReset()
})

EventsSDK.on("NetworkActivityChanged", unit => {
	let orbwalker = UnitsOrbWalker.get(unit)
	if (orbwalker === undefined)
		return

	let newNetworkActivity = unit.NetworkActivity
	if (!OrbWalker.attackActivities.includes(newNetworkActivity)) {
		if (OrbWalker.attackCancelActivities.includes(newNetworkActivity) && !orbwalker.CanMove(Game.RawGameTime + 0.05))
			orbwalker.LastAttackTime = 0
		return
	}
	orbwalker.LastAttackTime = Game.RawGameTime - (GameData.Ping / 2000)
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
		orbwalker.LastAttackTime = orbwalker.GetTurnTime(target, Game.RawGameTime) - (GameData.Ping / 2000)
})

