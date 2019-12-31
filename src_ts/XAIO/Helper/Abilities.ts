import { Ability, Unit, TickSleeper, GameSleeper, Game, Vector3 } from "wrapper/Imports"

let SleepTick = new TickSleeper(),
	AbilitySleep = new GameSleeper()

export class AbilitiesHelper {

	public get OrderCastDelay() {
		return (((Game.Ping / 1000) / 2) + 230)
	}

	public UseAbility(abil: Ability, HitAndRun: boolean = false, unit?: Unit | Vector3): boolean {

		if (unit instanceof Unit && !HitAndRun) {
			if (!unit?.IsAlive)
				return false

			if (abil.Owner!.TurnTime(unit?.Position) > 0.2) {
				if (SleepTick.Sleeping)
					return false

				abil.Owner!.AttackMove(unit?.Position)
				SleepTick.Sleep(abil.Owner!.TurnTime(unit?.Position) * 1000)
				return false
			}
		}

		if (abil === undefined || AbilitySleep.Sleeping(abil)) {
			return false
		}

		let castDelay = !abil.IsItem ? (((abil.CastPoint * 2) * 1000) + this.OrderCastDelay) : this.OrderCastDelay

		if (unit !== undefined) {
			abil.UseAbility(unit)
			AbilitySleep.Sleep(castDelay, abil)
			return true
		}

		abil.UseAbility(abil.Owner)
		AbilitySleep.Sleep(castDelay, abil)
		return true
	}

}

EventsSDK.on("GameEnded", () => {
	SleepTick.ResetTimer()
	AbilitySleep.FullReset()
})