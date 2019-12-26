//@ts-nocheck
import { Ability, Game, Hero, ExecuteOrder } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, Owner, initAbilityMap } from "../Listeners"
import { State, СomboAbility } from "../Menu"
function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady && !ability.IsInAbilityPhase
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}
let CancelOredr = true
function GetTarget(): Hero | undefined {
	return Heroes.sort((a, b) => b.Distance2D(Owner) - a.Distance2D(Owner))
		.filter(x => x.IsValid && x.IsAlive && x.IsEnemy() && !x.IsMagicImmune)
		.find(e => e.HasBuffByName("modifier_eul_cyclone"))
}
export function InitFindCyclone() {
	if (!Base.IsRestrictions(State))
		return
	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined)
		return
	let target = GetTarget()
	if (target === undefined)
		return
	let cycloneDebuff = target.GetBuffByName("modifier_eul_cyclone"),
		CastTime = Abilities.LightStrikeArray.CastPoint
			+ Abilities.LightStrikeArray.GetSpecialValue("light_strike_array_delay_time")
			+ (Owner.TurnTime(target.Position)) + (Game.Ping / 1000),
		RemainingTime = (cycloneDebuff !== undefined && cycloneDebuff.RemainingTime)
	if (RemainingTime <= CastTime) {
		setTimeout(() => CancelOredr = true, (CastTime * 1000))
		CancelOredr = false
	}
	if (!IsValidAbility(Abilities.LightStrikeArray, target) || RemainingTime > CastTime)
		return
	Abilities.UseAbility(Abilities.LightStrikeArray, false, true, target.Position)
	return
}

export function OnExecuteOrder(order: ExecuteOrder): boolean {
	return !Base.IsRestrictions(State) || CancelOredr
}
export function FindCycloneGameEnded() {
	// Sleep.ResetTimer()
}
