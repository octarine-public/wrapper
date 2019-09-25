import { Ability, GameSleeper, Hero, Item, Menu } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero } from "../Listeners"
import { LinkenBreakAbilityItems, LinkenBreakOnlyFromRange, State } from "../Menu"

let Sleep = new GameSleeper

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& !Sleep.Sleeping(`${target.Index + Name.Index}`)
		&& Selectror.IsEnabled(Name.Name)
		&& MyHero.Distance2D(target) <= Name.CastRange
}

export function BreakInit() {
	if (!Base.IsRestrictions(State)) {
		return false
	}
	let target = MouseTarget
	if (target === undefined || target.IsInvulnerable || target.IsMagicImmune)
		return false
	let Items = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)
	// Eul
	if (Items.Cyclone !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Cyclone.CanBeCasted()) {
		if (IsValid(Items.Cyclone, target, LinkenBreakAbilityItems)) {
			Items.Cyclone.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Cyclone.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// ForceStaff
	if (Items.ForceStaff !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.ForceStaff.CanBeCasted()) {
		if (IsValid(Items.ForceStaff, target, LinkenBreakAbilityItems)) {
			Items.ForceStaff.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.ForceStaff.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// Orchid
	if (Items.Orchid !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Orchid.CanBeCasted()) {
		if (IsValid(Items.Orchid, target, LinkenBreakAbilityItems)) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Orchid.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// Bloodthorn
	if (Items.Bloodthorn !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Bloodthorn.CanBeCasted()) {
		if (IsValid(Items.Bloodthorn, target, LinkenBreakAbilityItems)) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Bloodthorn.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// Nullifier
	if (Items.Nullifier !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Nullifier.CanBeCasted()) {
		if (IsValid(Items.Nullifier, target, LinkenBreakAbilityItems)) {
			Items.Nullifier.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Nullifier.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// RodofAtos
	if (Items.RodofAtos !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.RodofAtos.CanBeCasted()) {
		if (IsValid(Items.RodofAtos, target, LinkenBreakAbilityItems)) {
			Items.RodofAtos.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.RodofAtos.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// RodofAtos
	if (Items.Sheeps !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Items.Sheeps.CanBeCasted()) {
		if (IsValid(Items.Sheeps, target, LinkenBreakAbilityItems)) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Sheeps.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// ArcaneBolt
	if (Abilities.ArcaneBolt !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.ArcaneBolt.CanBeCasted()) {
		if (IsValid(Abilities.ArcaneBolt, target, LinkenBreakAbilityItems)) {
			Abilities.ArcaneBolt.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt), `${target.Index + Abilities.ArcaneBolt.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}

	// ArcaneBolt
	if (Abilities.AncientSeal !== undefined
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.AncientSeal.CanBeCasted()) {
		if (IsValid(Abilities.AncientSeal, target, LinkenBreakAbilityItems)) {
			Abilities.AncientSeal.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.AncientSeal), `${target.Index + Abilities.AncientSeal.Index}`)
			return true
		}
		else if (LinkenBreakOnlyFromRange.value) {
			return false
		}
	}
	return false
}
