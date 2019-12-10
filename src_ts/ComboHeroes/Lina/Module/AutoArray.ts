import { Ability, Game, Hero, TickSleeper, ExecuteOrder } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, Owner, initAbilityMap } from "../Listeners"
import { State, СomboAbility } from "../Menu"
function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady && !ability.IsInAbilityPhase
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}
let Sleep = new TickSleeper
let CancelOredr = true
function GetTarget(): Hero | undefined {
	return Heroes.sort((a, b) => b.Distance2D(Owner) - a.Distance2D(Owner))
		.filter(x => x.IsValid && x.IsAlive && x.IsEnemy() && !x.IsMagicImmune)
		.find(e => e.HasBuffByName("modifier_eul_cyclone"))
}
export function InitFindCyclone() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
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
	Abilities.LightStrikeArray.UseAbility(target.Position)
	Sleep.Sleep(Abilities.Tick)
	return
}

export function OnExecuteOrder(order: ExecuteOrder): boolean {
	if (!State.value)
		return true
	order.Execute()
	return CancelOredr
}
export function FindCycloneGameEnded() {
	Sleep.ResetTimer()
}