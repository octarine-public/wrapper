//@ts-nocheck
import { Ability, Game, Hero, ExecuteOrder, GameSleeper, Flow_t } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Owner, initAbilityMap } from "../Listeners"
import { State, СomboAbility } from "../Menu"
function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady && !ability.IsInAbilityPhase
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}
let CancelOredr = true
let Sleep = new GameSleeper()
function GetTarget(): Hero | undefined {
	return EntityManager.GetEntitiesByClass(Hero).sort((a, b) => b.Distance2D(Owner) - a.Distance2D(Owner))
		.find(x => !x.IsIllusion && x.IsAlive && x.IsEnemy() && !x.IsMagicImmune && x.HasBuffByName("modifier_eul_cyclone"))
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
			+ ((Owner.TurnTime(target.Position)) + Game.Ping / 1000) - 0.025,
		RemainingTime = (cycloneDebuff !== undefined && cycloneDebuff.RemainingTime)

	if (RemainingTime <= CastTime) {
		CancelOredr = true
		Sleep.Sleep((CastTime * 1000), Abilities.LightStrikeArray.Index)
	}
	if (!IsValidAbility(Abilities.LightStrikeArray, target) || RemainingTime > CastTime)
		return
	if (!Abilities.UseAbility(Abilities.LightStrikeArray, false, true, target.Position) || !Sleep.Sleeping(Abilities.LightStrikeArray.Index)) {
		CancelOredr = false
		return
	}
}

export function OnExecuteOrder(order: ExecuteOrder): boolean {
	return !Base.IsRestrictions(State) || CancelOredr
}
export function FindCycloneGameEnded() {
	Sleep.FullReset()
}
