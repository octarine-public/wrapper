import { Base } from "../Extends/Helper";
import { MouseTarget, MyHero } from "../Listeners";
import { active, popLinkItems, popLotusItems } from "../MenuManager";
import { GameSleeper, Ability, Item, Hero, Menu } from "wrapper/Imports";

let Sleep = new GameSleeper

import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& !Sleep.Sleeping(`${target.Index + Name.Index}`)
		&& Selectror.IsEnabled(Name.Name)
		&& MyHero.Distance2D(target) <= Name.CastRange
}

export function BreakInit() {
	if (!Base.IsRestrictions(active)) {
		return false
	}
	let target = MouseTarget
	if (target === undefined)
		return false
	let Items = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)
	// Eul
	if (Items.Cyclone !== undefined
		&& Items.Cyclone.CanBeCasted()) {
		if (IsValid(Items.Cyclone, target, popLinkItems)) {
			Items.Cyclone.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Cyclone.Index}`)
			return true
		}
	}
	// Dagon
	if (Items.Dagon !== undefined
		&& Items.Dagon.CanBeCasted()) {
		if (IsValid(Items.Dagon, target, popLinkItems)||IsValid(Items.Dagon,target, popLotusItems))
		{
			Items.Dagon.UseAbility(target)
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Dagon.Index}`)
			return true
		}	
	}
	// ethereal
	if (Items.Ethereal!==undefined
		&&Items.Ethereal.CanBeCasted()) {
		if (IsValid(Items.Ethereal, target, popLinkItems)||IsValid(Items.Ethereal, target, popLotusItems))
		{
			Items.Ethereal.UseAbility(target)
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Ethereal.Index}`)
			return true
		}
		}
	// ForceStaff
	if (Items.ForceStaff !== undefined
		&& Items.ForceStaff.CanBeCasted()) {
		if (IsValid(Items.ForceStaff, target, popLinkItems)) {
			Items.ForceStaff.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.ForceStaff.Index}`)
			return true
		}
	}
	
	// Orchid
	if (Items.Orchid !== undefined
		&& Items.Orchid.CanBeCasted()) {
		if (IsValid(Items.Orchid, target, popLinkItems)) {
			Items.Orchid.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Orchid.Index}`)
			return true
		}
	}
	
	// Bloodthorn
	if (Items.Bloodthorn !== undefined
		&& Items.Bloodthorn.CanBeCasted()) {
		if (IsValid(Items.Bloodthorn, target, popLinkItems)) {
			Items.Bloodthorn.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Bloodthorn.Index}`)
			return true
		}
	}
	
	// Nullifier
	if (Items.Nullifier !== undefined
		&& Items.Nullifier.CanBeCasted()) {
		if (IsValid(Items.Nullifier, target, popLinkItems)) {
			Items.Nullifier.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Nullifier.Index}`)
			return true
		}
	}
	
	// RodofAtos
	if (Items.RodofAtos !== undefined
		&& Items.RodofAtos.CanBeCasted()) {
		if (IsValid(Items.RodofAtos, target, popLinkItems)) {
			Items.RodofAtos.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.RodofAtos.Index}`)
			return true
		}
	}
	
	// Sheep
	if (Items.Sheeps !== undefined
		&& Items.Sheeps.CanBeCasted()) {
		if (IsValid(Items.Sheeps, target, popLinkItems)) {
			Items.Sheeps.UseAbility(target);
			Sleep.Sleep(Base.SleepTimeDefualt, `${target.Index + Items.Sheeps.Index}`)
			return true
		}
	}
	
	// Laser
	if (Abilities.q !== undefined
		&& Abilities.q.CanBeCasted()) {
		if (IsValid(Abilities.q, target, popLinkItems)||IsValid(Abilities.q, target, popLotusItems)) {
			Abilities.q.UseAbility(target);
			Sleep.Sleep(Abilities.CastDelay(Abilities.q), `${target.Index + Abilities.q.Index}`)
			return true
		}
	}

	
	return false
}
