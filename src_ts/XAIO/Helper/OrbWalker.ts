import { Unit, Game, Utils, dotaunitorder_t, Vector3 } from "wrapper/Imports"

let TurnEndTime = 0
let LastAttackTime = 0

export class OrbWalker {

	public OrbwalkingPoint: Vector3 = new Vector3
	public LastMoveOrderIssuedTime = 0
	public LastAttackOrderIssuedTime = 0

	constructor(public Unit: Unit) {

		EventsSDK.on("NetworkActivityChanged", (npc) => {
			if (LocalPlayer === undefined || LocalPlayer.Hero === undefined)
				return

			if (npc !== LocalPlayer.Hero)
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
			if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET && args.Unit !== this.Unit)
				return

			let target = args.Target as Unit

			if (target === undefined || !target.IsValid)
				return

			if (this.CanMove(Game.RawGameTime))
				LastAttackTime = this.GetTurnTime(target, Game.RawGameTime) - this.PingTime
		})
	}

	public Execute(target: Unit): boolean {
		let time = Game.RawGameTime

		if (TurnEndTime > time)
			return false

		if (this.Unit.IsChanneling || !this.Unit.IsAlive || this.Unit.IsStunned)
			return false

		if ((target !== undefined && this.CanAttack(target, time)) || !this.CanMove(time))
			return this.CanAttack(target, time) && this.Attack(target, time)

		if (!this.OrbwalkingPoint.IsZero())
			return this.Move(this.OrbwalkingPoint, time)

		return this.Move(Utils.CursorWorldVec, time)
	}

	public Move(position: Vector3, time: number): boolean {
		if (!this.Unit.IsMoving) {
			this.Unit.MoveTo(position)
			this.LastMoveOrderIssuedTime = time
			return true
		}

		return false
	}

	public Attack(unit: Unit, time: number) {
		if (time - this.LastAttackOrderIssuedTime < 5 / 1000)
			return false
		TurnEndTime = this.GetTurnTime(unit, time)
		if (this.Unit.CanAttack(unit)) {
			this.Unit.AttackTarget(unit)
			this.LastAttackOrderIssuedTime = time
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
		return this.Unit.CanAttack && this.GetTurnTime(target, time) - LastAttackTime > 1 / this.Unit.AttacksPerSecond
	}

	public GetTurnTime(unit: Unit, time: number): number {
		return time + this.PingTime + this.Unit.TurnTime(unit.Position) + 0.1 / 1000
	}

	public CanMove(time: number) {
		return ((time - 0.1) + this.PingTime) - LastAttackTime > this.Unit.AttackPoint
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


EventsSDK.on("GameEnded", () => {
	TurnEndTime = 0
	LastAttackTime = 0
})