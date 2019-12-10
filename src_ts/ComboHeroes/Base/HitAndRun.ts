import { Unit, Game, Utils, TickSleeper } from "wrapper/Imports";
let TurnEndTime = 0;
let LastAttackTime = 0;
let Sleep = new TickSleeper
export class HitAndRun {
	constructor(public Unit?: Unit) { }
	/**
	 * CanAttack
	 * @param target | Enemy
	 * @param time | ms
	 */
	public CanAttack(target: Unit, time: number) {
		return this.Unit.CanAttack(target) && (this.GetTurnTime(target, time) - TurnEndTime) > (1 / this.Unit.AttacksPerSecond);
	}
	/**
	 * ExecuteTo
	 * @param target | Enemy
	 * @param MoveTo type |  0 = enemy Position, any number return
	 */
	public ExecuteTo(target: Unit, type: number): boolean {
		var time = Game.RawGameTime;
		if (TurnEndTime > time) {
			return false;
		}
		if ((!target.IsValid || !this.CanAttack(target, time)) && this.CanMove(time) && !Sleep.Sleeping) {
			switch (type) {
				case 0:
					this.Unit.MoveTo(target.Position)
					Sleep.Sleep(150)
					break;
				case 1:
					this.Unit.MoveTo(Utils.CursorWorldVec)
					Sleep.Sleep(150)
					break;
				default: break;
			}
			return false;
		}
		if (!this.CanAttack(target, time)) {
			return false
		}
		TurnEndTime = this.GetTurnTime(target, time);
		LastAttackTime = TurnEndTime - (Game.Ping / 2000);
		return true;
	}
	/**
	 * Clear all vars
	 */
	public ClearVars() {
		TurnEndTime = 0
		LastAttackTime = 0
	}
	private GetTurnTime(target: Unit, time: number) {
		return time + (Game.Ping / 2000) + this.Unit.TurnTime(target.Position);
	}
	private CanMove(time: number) {
		return (((time - 0.15) + (Game.Ping / 2000)) - LastAttackTime) > this.Unit.AttackPoint;
	}
}