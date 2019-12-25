import { Ability, Hero, Unit, TickSleeper, GameSleeper, Game, Vector3 } from "wrapper/Imports"
let Sleep = new GameSleeper
let SleepTick = new TickSleeper
export class AbilityHelper {
	constructor(public readonly unit?: Hero | Unit) { }

	public get Tick() {
		return (((Game.Ping / 1000) / 2) + 230)
	}

	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit!.Position) * 1000) + this.Tick)
	}

	public UseAbility(abil: Ability, owner: boolean = false, HitAndRun: boolean = false, unit?: Unit | Vector3): boolean {
		if (unit instanceof Unit && !HitAndRun) {
			if (!unit?.IsAlive)
				return false
			if (this.unit!.TurnTime(unit?.Position) > 0.2) {
				if (SleepTick.Sleeping)
					return false
				this.unit!.AttackMove(unit?.Position)
				SleepTick.Sleep(this.unit!.TurnTime(unit?.Position) * 1000)
				return false
			}
		}
		if (abil === undefined || Sleep.Sleeping(abil.Index))
			return false
		let castDelay = !abil.IsItem ? (((abil.CastPoint * 2) * 1000) + this.Tick) : this.Tick
		if (unit !== undefined) {
			abil.UseAbility(unit)
			Sleep.Sleep(castDelay, abil.Index)
			return true
		}
		owner ? abil.UseAbility(this.unit) : abil.UseAbility()
		Sleep.Sleep(castDelay, abil.Index)
		return true
	}
}
