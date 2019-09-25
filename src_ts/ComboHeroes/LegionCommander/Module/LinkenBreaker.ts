import { Ability, GameSleeper, Hero, Item, Menu } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner } from "../Listeners"
import { LinkenBreakerToggler, State, UseOnlyFromRangeItem } from "../Menu"

let Sleep = new GameSleeper

import InitItems from "../Extends/Items"

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& !Sleep.Sleeping(`${target.Index + Name.Index}`)
		&& Selectror.IsEnabled(Name.Name)
		&& Owner.Distance2D(target) <= Name.CastRange
}

export function BreakInit() {
	if (!Base.IsRestrictions(State)) {
		return false
	}
	let target = MouseTarget
	if (target === undefined || target.IsInvulnerable || target.IsMagicImmune)
		return false
	let Items = new InitItems(Owner)
	// Eul
	if (Items.Cyclone !== undefined
		&& Items.Cyclone.CanBeCasted()) {
		if (IsValid(Items.Cyclone, target, LinkenBreakerToggler)) {
			Items.Cyclone.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Cyclone.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	if (Items.Abyssal !== undefined
		&& Items.Abyssal.CanBeCasted()) {
		if (IsValid(Items.Abyssal, target, LinkenBreakerToggler)) {
			Items.Abyssal.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Abyssal.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Heavens Halberd
	if (Items.HeavensHalberd !== undefined
		&& Items.HeavensHalberd.CanBeCasted()) {
		if (IsValid(Items.HeavensHalberd, target, LinkenBreakerToggler)) {
			Items.HeavensHalberd.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.HeavensHalberd.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// ForceStaff
	if (Items.ForceStaff !== undefined
		&& Items.ForceStaff.CanBeCasted()) {
		if (IsValid(Items.ForceStaff, target, LinkenBreakerToggler)) {
			Items.ForceStaff.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.ForceStaff.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// Orchid
	if (Items.Orchid !== undefined
		&& Items.Orchid.CanBeCasted()) {
		if (IsValid(Items.Orchid, target, LinkenBreakerToggler)) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Orchid.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// Bloodthorn
	if (Items.Bloodthorn !== undefined
		&& Items.Bloodthorn.CanBeCasted()) {
		if (IsValid(Items.Bloodthorn, target, LinkenBreakerToggler)) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Bloodthorn.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Nullifier
	if (Items.Nullifier !== undefined
		&& Items.Nullifier.CanBeCasted()) {
		if (IsValid(Items.Nullifier, target, LinkenBreakerToggler)) {
			Items.Nullifier.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Nullifier.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// RodofAtos
	if (Items.RodofAtos !== undefined
		&& Items.RodofAtos.CanBeCasted()) {
		if (IsValid(Items.RodofAtos, target, LinkenBreakerToggler)) {
			Items.RodofAtos.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.RodofAtos.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Sheeps
	if (Items.Sheeps !== undefined
		&& Items.Sheeps.CanBeCasted()) {
		if (IsValid(Items.Sheeps, target, LinkenBreakerToggler)) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Sheeps.Index}`)
			return true
		}
		else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
}