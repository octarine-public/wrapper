import { Ability, Hero, Item, Menu, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner } from "../Listeners"
import { LinkenBreakerToggler, State, UseOnlyFromRangeItem } from "../Menu"

let Sleep = new TickSleeper()

import InitItems from "../Extends/Items"

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted()
		&& Selectror.IsEnabled(Name.Name)
		&& Owner.Distance2D(target) <= Name.CastRange
}

export function BreakInit() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping) {
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
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Heavens Halberd
	if (Items.HeavensHalberd !== undefined
		&& Items.HeavensHalberd.CanBeCasted()) {
		if (IsValid(Items.HeavensHalberd, target, LinkenBreakerToggler)) {
			Items.HeavensHalberd.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Diffusal Blade
	if (Items.DiffusalBlade !== undefined
		&& Items.DiffusalBlade.CanBeCasted()) {
		if (IsValid(Items.DiffusalBlade, target, LinkenBreakerToggler)) {
			Items.DiffusalBlade.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// HurricanePike
	if (Items.HurricanePike !== undefined
		&& Items.HurricanePike.CanBeCasted()) {
		if (IsValid(Items.HurricanePike, target, LinkenBreakerToggler)) {
			Items.HurricanePike.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// ForceStaff
	if (Items.ForceStaff !== undefined
		&& Items.ForceStaff.CanBeCasted()) {
		if (IsValid(Items.ForceStaff, target, LinkenBreakerToggler)) {
			Items.ForceStaff.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// Orchid
	if (Items.Orchid !== undefined
		&& Items.Orchid.CanBeCasted()) {
		if (IsValid(Items.Orchid, target, LinkenBreakerToggler)) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}

	// Bloodthorn
	if (Items.Bloodthorn !== undefined
		&& Items.Bloodthorn.CanBeCasted()) {
		if (IsValid(Items.Bloodthorn, target, LinkenBreakerToggler)) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Nullifier
	if (Items.Nullifier !== undefined
		&& Items.Nullifier.CanBeCasted()) {
		if (IsValid(Items.Nullifier, target, LinkenBreakerToggler)) {
			Items.Nullifier.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// RodofAtos
	if (Items.RodofAtos !== undefined
		&& Items.RodofAtos.CanBeCasted()) {
		if (IsValid(Items.RodofAtos, target, LinkenBreakerToggler)) {
			Items.RodofAtos.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
	// Sheeps
	if (Items.Sheeps !== undefined
		&& Items.Sheeps.CanBeCasted()) {
		if (IsValid(Items.Sheeps, target, LinkenBreakerToggler)) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		} else if (UseOnlyFromRangeItem.value) {
			return false
		}
	}
}

export function DeleteLinkenBreakAllVars() {
	Sleep.ResetTimer()
}