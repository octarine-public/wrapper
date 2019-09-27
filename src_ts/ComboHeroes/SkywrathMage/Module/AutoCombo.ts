import { Base } from "../Extends/Helper"
import { Heroes, MyHero } from "../Listeners"

import { Ability, ArrayExtensions, Game, Hero, Item, Menu, Sleeper } from "wrapper/Imports"
import { AutoComboAbility, AutoComboDisableWhen, AutoComboItems, AutoComboMinHPpercent, AutoComboState, BladeMailCancelCombo, ComboKey, SmartConShotRadius, State } from "../Menu"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
import { BreakInit } from "./LinkenBreaker"

let Sleep = new Sleeper

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& !Base.CancelAbilityRealm(target)
		&& !Sleep.Sleeping(`${target.Index + Name.Index}`)
		&& Selectror.IsEnabled(Name.Name)
		&& MyHero.Distance2D(target) <= Name.CastRange
}

export function AutoCombo() {
	if (!Base.IsRestrictions(State) || !AutoComboState.value) {
		return false
	}
	if (AutoComboDisableWhen.value && ComboKey.is_pressed) {
		return false
	}
	let target = ArrayExtensions.orderBy(Heroes.filter(x => x.IsEnemy() && Base.Active(x) && x.IsStunned
		&& !x.IsMagicImmune && x.IsAlive || Base.TriggerAutoCombo(x)), x => x.Distance2D(MyHero))[0]

	if (target === undefined || !Base.Cancel(target) || Base.AeonDisc(target, false) || (BladeMailCancelCombo.value && target.HasModifier("modifier_item_blade_mail_reflect"))) {
		return false
	}
	if (target.HPPercent > AutoComboMinHPpercent.value && AutoComboMinHPpercent.value !== 0) {
		return false
	}
	if (Base.IsLinkensProtected(target)) {
		BreakInit()
		return false
	}
	let Items = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)

	if (IsValid(Items.Sheeps, target, AutoComboItems)) {
		Items.Sheeps.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Sheeps.Index}`)
		return true
	}

	// Orchid
	if (IsValid(Items.Orchid, target, AutoComboItems)) {
		Items.Orchid.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Orchid.Index}`)
		return true
	}

	// Bloodthorn
	if (IsValid(Items.Bloodthorn, target, AutoComboItems)) {
		Items.Bloodthorn.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Bloodthorn.Index}`)
		return true
	}

	// AncientSeal
	if (IsValid(Abilities.AncientSeal, target, AutoComboAbility)) {
		Abilities.AncientSeal.UseAbility(target)
		Sleep.Sleep(Abilities.CastDelay(Abilities.AncientSeal), `${target.Index + Abilities.AncientSeal.Index}`)
		return true
	}
	// RodofAtos
	if (IsValid(Items.RodofAtos, target, AutoComboItems)) {
		Items.RodofAtos.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.RodofAtos.Index}`)
		return true
	}

	// MysticFlare
	if (IsValid(Abilities.MysticFlare, target, AutoComboAbility)) {
		if (Items.RodofAtos === undefined) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.MysticFlare.Index}`)
			return true
		} else if (Items.RodofAtos !== undefined && Sleep.Sleeping("RodofAtosDelay")) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.MysticFlare.Index}`)
			return true
		} else if (Items.RodofAtos.Cooldown <= (Items.RodofAtos.CooldownLength - 1) && !Items.RodofAtosDelay) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.MysticFlare.Index}`)
			return true
		}
	}

	// ConcussiveShot
	if (Abilities.ConcussiveShot !== undefined
		&& !Sleep.Sleeping(`${target.Index + Abilities.ConcussiveShot.Index}`)
		&& AutoComboAbility.IsEnabled(Abilities.ConcussiveShot.Name)
		&& Abilities.ConcussiveShot.CanBeCasted()
		&& MyHero.Distance2D(target.Position) <= SmartConShotRadius.value + target.HullRadius) {
		Abilities.ConcussiveShot.UseAbility()
		Sleep.Sleep(Items.Tick, `${target.Index + Abilities.ConcussiveShot.Index}`)
		return true
	}

	// ArcaneBolt
	if (IsValid(Abilities.ArcaneBolt, target, AutoComboAbility)) {
		Abilities.ArcaneBolt.UseAbility(target)
		Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt), `${target.Index + Abilities.ArcaneBolt.Index}`)
		return true
	}

	// Veil
	if (IsValid(Items.Discord, target, AutoComboItems)) {
		Items.Discord.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Discord.Index}`)
		return true
	}

	// Ethereal
	if (
		Items.Ethereal !== undefined
		&& AutoComboItems.IsEnabled(Items.Ethereal.Name)
		&& !Base.CancelAbilityRealm(target)
		&& !Sleep.Sleeping(`${target.Index + Items.Ethereal.Index}`)
		&& Items.Ethereal.CanBeCasted()
		&& MyHero.Distance2D(target) <= Items.Ethereal.CastRange
	) {
		Items.Ethereal.UseAbility(target)
		Sleep.Sleep(Items.Tick, `${target.Index + Items.Ethereal.Index}`)
		return true
	}

	// Dagon
	if ((Items.EtherealDelay || Items.Ethereal === undefined) || target.IsEthereal) {
		if (
			Items.Dagon !== undefined
			&& AutoComboItems.IsEnabled("item_dagon_5")
			&& !Base.CancelAbilityRealm(target)
			&& !Sleep.Sleeping(`${target.Index + Items.Dagon.Index}`)
			&& Items.Dagon.CanBeCasted() && MyHero.Distance2D(target) <= Items.Dagon.CastRange
			&& (
				Abilities.AncientSeal === undefined
				|| target.HasModifier("modifier_skywrath_mage_ancient_seal")
				|| !AutoComboItems.IsEnabled(Abilities.AncientSeal.Name)
			)
			&& (
				Items.Ethereal === undefined
				|| (target.IsEthereal && !Items.Ethereal.CanBeCasted())
				|| !AutoComboItems.IsEnabled(Items.Ethereal.Name)
			)
		) {
			Items.Dagon.UseAbility(target)
			Sleep.Sleep(Items.Tick, `${target.Index + Items.Dagon.Index}`)
			return true
		}
	}
	return false
}
export function AutoComboDeleteVars() {
	Sleep.FullReset()
}