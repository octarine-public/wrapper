import { Ability, Hero, Item, Menu, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero, initItemsMap, initAbilityMap } from "../Listeners"
import { LinkenBreakAbilityItems, LinkenBreakOnlyFromRange, State } from "../Menu"

let Sleep = new TickSleeper()

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& Selectror.IsEnabled(Name.Name)
		&& MyHero.Distance2D(target) <= Name.CastRange
}

export function BreakInit() {
	if (!Base.IsRestrictions(State))
		return
	let target = MouseTarget
	if (target === undefined || target.IsInvulnerable || target.IsMagicImmune || Sleep.Sleeping)
		return

	let Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero)

	if (Items === undefined || Abilities === undefined) {
		return
	}
	// Eul
	if (Items.Cyclone !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Cyclone.CanBeCasted()) {
		if (IsValid(Items.Cyclone, target, LinkenBreakAbilityItems)) {
			Items.Cyclone.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// ForceStaff
	if (Items.ForceStaff !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.ForceStaff.CanBeCasted()) {
		if (IsValid(Items.ForceStaff, target, LinkenBreakAbilityItems)) {
			Items.ForceStaff.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// Orchid
	if (Items.Orchid !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Orchid.CanBeCasted()) {
		if (IsValid(Items.Orchid, target, LinkenBreakAbilityItems)) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// Bloodthorn
	if (Items.Bloodthorn !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Bloodthorn.CanBeCasted()) {
		if (IsValid(Items.Bloodthorn, target, LinkenBreakAbilityItems)) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// ArcaneBolt
	if (Abilities.ArcaneBolt !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.ArcaneBolt.CanBeCasted()) {
		if (IsValid(Abilities.ArcaneBolt, target, LinkenBreakAbilityItems)) {
			Abilities.ArcaneBolt.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt))
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// ArcaneBolt
	if (Abilities.AncientSeal !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.AncientSeal.CanBeCasted()) {
		if (IsValid(Abilities.AncientSeal, target, LinkenBreakAbilityItems)) {
			Abilities.AncientSeal.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.AncientSeal))
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// Nullifier
	if (Items.Nullifier !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Nullifier.CanBeCasted()) {
		if (IsValid(Items.Nullifier, target, LinkenBreakAbilityItems)) {
			Items.Nullifier.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// RodofAtos
	if (Items.RodofAtos !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.RodofAtos.CanBeCasted()) {
		if (IsValid(Items.RodofAtos, target, LinkenBreakAbilityItems)) {
			Items.RodofAtos.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}

	// RodofAtos
	if (Items.Sheeps !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Sheeps.CanBeCasted()) {
		if (IsValid(Items.Sheeps, target, LinkenBreakAbilityItems)) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		} else if (LinkenBreakOnlyFromRange.value) {
			return
		}
	}
	return
}
export function LinkenBreakerDeleteVars() {
	Sleep.ResetTimer()
}
