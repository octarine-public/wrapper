import { Ability, Hero, Item, Menu, Sleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, MyHero } from "../Listeners"
import { AutoDisableAbilityItems, AutoDisableState, ComboKey, State } from "../Menu"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"

let Sleep = new Sleeper()

function IsValidDisable(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && !Sleep.Sleeping(`${target.Index + Name.Index}`)
		&& Selectror.IsEnabled(Name.Name) && !Name.IsInAbilityPhase
		&& !Base.CancelAbilityRealm(target)
		&& Name.CanBeCasted() && MyHero.Distance2D(target) <= Name.CastRange
}
export function AutoDisable() {
	if (!Base.IsRestrictions(State) || !AutoDisableState.value || ComboKey.is_pressed)
		return false
	let target = Heroes.find(x => x.IsEnemy() && x.IsVisible && x.IsAlive && !x.IsIllusion && x.IsValid && Base.Disable(x) && !x.IsMagicImmune)

	if (target === undefined) {
		return false
	}

	let Items = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)

	if (IsValidDisable(Items.Sheeps, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Sheeps, target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Sheeps.Index}`)
		return true
	}

	if (IsValidDisable(Items.Orchid, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Orchid, target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Orchid.Index}`)
		return true
	}

	if (IsValidDisable(Items.Bloodthorn, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Bloodthorn, target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Bloodthorn.Index}`)
		return true
	}

	if (IsValidDisable(Abilities.AncientSeal, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Abilities.AncientSeal, target)
		Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.AncientSeal.Index}`)
		return true
	}

	return false
}
export function AutoDisableDeleteVars() {
	Sleep.FullReset()
}