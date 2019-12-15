import { Ability, Hero, Menu } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner, initItemsMap } from "../Listeners"
import { LinkenBreakerToggler, State } from "../Menu"

function IsValid(Name: Ability, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& Selectror.IsEnabled(Name.Name)
		&& Owner.Distance2D(target) <= Name.CastRange
}
function ItemCast(abil: Ability, target: Hero) {
	if (IsValid(abil, target, LinkenBreakerToggler)) {
		abil.UseAbility(target)
		return true
	}
}
export function BreakInit() {
	if (!Base.IsRestrictions(State))
		return
	let target = MouseTarget
	if (target === undefined || target.IsInvulnerable || target.IsMagicImmune)
		return
	let Items = initItemsMap.get(Owner)
	if (Items === undefined)
		return
	let arr_linken: Ability[] = [
		Items.DiffusalBlade,
		Items.Cyclone,
		Items.Abyssal,
		Items.HeavensHalberd,
		Items.ForceStaff,
		Items.Orchid,
		Items.Bloodthorn,
		Items.Nullifier,
		Items.RodofAtos,
		Items.Sheeps
	]
	if (arr_linken.some(item => ItemCast(item, target)))
		return
}