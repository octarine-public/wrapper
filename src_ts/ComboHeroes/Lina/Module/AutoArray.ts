import { Ability, Game, Hero, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, Owner, initAbilityMap } from "../Listeners"
import { State, СomboAbility } from "../Menu"
function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}
let Sleep = new TickSleeper()
export function InitFindCyclone() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return

	let target = Heroes.sort((a, b) => b.Distance2D(Owner) - a.Distance2D(Owner))
		.filter(x => x.IsValid && x.IsAlive && x.IsEnemy() && !x.IsMagicImmune)
		.find(e => e.HasModifier("modifier_eul_cyclone"))
	if (target === undefined)
		return

	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined)
		return

	let cycloneDebuff = target.GetBuffByName("modifier_eul_cyclone")
	let CastTime = Abilities.LightStrikeArray.CastPoint + Abilities.LightStrikeArray.GetSpecialValue("light_strike_array_delay_time") + (GetAvgLatency(Flow_t.OUT))
	if (IsValidAbility(Abilities.LightStrikeArray, target) && (cycloneDebuff !== undefined && cycloneDebuff.DieTime - Game.RawGameTime) <= CastTime) {
		Abilities.LightStrikeArray.UseAbility(target.Position)
		Sleep.Sleep(Abilities.Tick)
		return
	}
}
export function FindCycloneGameEnded() {
	Sleep.ResetTimer()
}