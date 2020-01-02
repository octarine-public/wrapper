import { Unit, Game, Utils, dotaunitorder_t, Vector3, GameSleeper } from "wrapper/Imports"
import { Units } from "../bootstrap"
import { stateGlobal, OrbWalkerState } from "../Menu/Base"

let TurnEndTime = 0
let LastAttackTime = 0
let Sleep = new GameSleeper
export let UnitsOrbWalker: OrbWalker[] = []


class OrbWalker {

	public OrbwalkingPoint: Vector3 = new Vector3
	public LastMoveOrderIssuedTime = 0
	public LastAttackOrderIssuedTime = 0

	constructor(public unit: Unit) {

		EventsSDK.on("NetworkActivityChanged", (npc) => {

			if (this.unit === undefined || npc !== this.unit)
				return

			let newNetworkActivity = npc.NetworkActivity
			if (!this.attackActivities.includes(newNetworkActivity)) {
				if (this.attackCancelActivities.includes(newNetworkActivity) && !this.CanMove(Game.RawGameTime + 0.05))
					LastAttackTime = 0
				return
			}
			LastAttackTime = Game.RawGameTime - this.PingTime
		})

		EventsSDK.on("PrepareUnitOrders", (args) => {
			if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET && args.Unit !== this.unit)
				return

			let target = args.Target as Unit

			if (target === undefined || !target.IsValid)
				return

			if (this.CanMove(Game.RawGameTime))
				LastAttackTime = this.GetTurnTime(target, Game.RawGameTime) - this.PingTime
		})
	}

	public Execute(target: Unit): boolean {
		if (Sleep.Sleeping(this.unit.Index))
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

		return this.Move(Utils.CursorWorldVec, time)
	}

	public Move(position: Vector3, time: number): boolean {
		if (this.unit.IsMoving)
			return false

		this.unit.MoveTo(position)
		this.LastMoveOrderIssuedTime = time
		Sleep.Sleep(this.LastMoveOrderIssuedTime / 5, this.unit.Index)
		return true
	}

	public Attack(unit: Unit, time: number) {
		if (time - this.LastAttackOrderIssuedTime < 5 / 1000)
			return false
		TurnEndTime = this.GetTurnTime(unit, time)
		if (this.unit.CanAttack(unit)) {
			this.unit.AttackTarget(unit)
			this.LastAttackOrderIssuedTime = time
			Sleep.Sleep(this.LastAttackOrderIssuedTime / 5, this.unit.Index)
			return true
		}
		return false
	}

	/**
	 * CanAttack
	 * @param target | Enemy
	 * @param time | ms
	 */

	public CanAttack(target: Unit, time: number) {
		return this.unit.CanAttack && this.GetTurnTime(target, time) - LastAttackTime > 1 / this.unit.AttacksPerSecond
	}

	public GetTurnTime(unit: Unit, time: number): number {
		return time + this.PingTime + this.unit.TurnTime(unit.Position) + 0.1 / 1000
	}

	public CanMove(time: number) {
		return ((time - 0.1) + this.PingTime) - LastAttackTime > this.unit.AttackPoint
	}


	private attackActivities: GameActivity_t[] = [
		GameActivity_t.ACT_DOTA_ATTACK,
		GameActivity_t.ACT_DOTA_ATTACK2,
		GameActivity_t.ACT_DOTA_ATTACK_EVENT
	]

	private get PingTime() {
		return Game.Ping / 2000
	}

	private attackCancelActivities: GameActivity_t[] = [
		GameActivity_t.ACT_DOTA_IDLE,
		GameActivity_t.ACT_DOTA_IDLE_RARE,
		GameActivity_t.ACT_DOTA_RUN
	]
}


EventsSDK.on("Tick", () => {
	if (!stateGlobal.value || !OrbWalkerState.value)
		return

	Units.forEach(unit =>
		unit.Name !== "npc_dota_courier"
		&& unit.IsAlive
		&& !unit.IsEnemy()
		&& unit.IsControllable
		&& (UnitsOrbWalker[unit.Index] = new OrbWalker(unit)))

	UnitsOrbWalker.some(x => !x.unit.IsAlive && (UnitsOrbWalker = []))
})


EventsSDK.on("GameEnded", () => {
	TurnEndTime = 0
	LastAttackTime = 0
	UnitsOrbWalker = []
})