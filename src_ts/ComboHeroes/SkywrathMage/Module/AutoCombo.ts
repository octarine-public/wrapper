import { Base } from "../Extends/Helper"
import { Heroes, MyHero, ProjList, initItemsMap, initAbilityMap } from "../Listeners"
import { Ability, ArrayExtensions, Hero, Item, Menu, TickSleeper } from "wrapper/Imports"
import {
	AutoComboAbility,
	AutoComboDisableWhen, AutoComboItems,
	AutoComboMinHPpercent, AutoComboState,
	BladeMailCancelCombo, ComboKey, ConcussiveShotAwait,
	SmartConShotRadius, State
} from "../Menu"
import { BreakInit } from "./LinkenBreaker"

let Sleep = new TickSleeper()

function IsValid(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined && Name.CanBeCasted() && !Name.IsInAbilityPhase
		&& !Base.CancelAbilityRealm(target)
		&& Selectror.IsEnabled(Name.Name)
		&& MyHero.Distance2D(target) <= (Name.Name === "skywrath_mage_mystic_flare" ? (Name.CastRange - 100) : Name.CastRange)
}

export function AutoCombo() {
	if (!Base.IsRestrictions(State) || !AutoComboState.value || Sleep.Sleeping) {
		return
	}
	if (AutoComboDisableWhen.value && ComboKey.is_pressed) {
		return
	}
	let target = ArrayExtensions.orderBy(Heroes.filter(x => x.IsEnemy() && Base.Active(x) && x.IsStunned
		&& !x.IsMagicImmune && x.IsAlive || Base.TriggerAutoCombo(x)), x => x.Distance2D(MyHero))[0]

	if (target === undefined || !Base.Cancel(target) || Base.AeonDisc(target, false) || (BladeMailCancelCombo.value && target.HasBuffByName("modifier_item_blade_mail_reflect"))) {
		return
	}
	if (target.HPPercent > AutoComboMinHPpercent.value && AutoComboMinHPpercent.value !== 0) {
		return
	}
	if (Base.IsLinkensProtected(target)) {
		BreakInit()
		return
	}
	let Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero)

	if (Items === undefined || Abilities === undefined) {
		return
	}

	let RodofAtosDelay = ProjList.find(x => x.ParticlePath === "particles/items2_fx/rod_of_atos_attack.vpcf"),
		EtherealDelay = ProjList.find(x => x.ParticlePath === "particles/items_fx/ethereal_blade.vpcf"),
		ConcussiveShotDelay = ProjList.find(x => x.ParticlePath === "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf")

	if (IsValid(Items.Sheeps, target, AutoComboItems)) {
		Items.Sheeps.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// Orchid
	if (IsValid(Items.Orchid, target, AutoComboItems)) {
		Items.Orchid.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// Bloodthorn
	if (IsValid(Items.Bloodthorn, target, AutoComboItems)) {
		Items.Bloodthorn.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// AncientSeal
	if (IsValid(Abilities.AncientSeal, target, AutoComboAbility)) {
		Abilities.AncientSeal.UseAbility(target)
		Sleep.Sleep(Abilities.CastDelay(Abilities.AncientSeal))
		return
	}
	// RodofAtos
	if (IsValid(Items.RodofAtos, target, AutoComboItems)) {
		Items.RodofAtos.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// MysticFlare
	if (IsValid(Abilities.MysticFlare, target, AutoComboAbility)) {
		if (Items.RodofAtos === undefined
			&& ConcussiveShotAwait.value
			&& Abilities.ConcussiveShot !== undefined
			&& (
				ConcussiveShotDelay !== undefined && target.Distance2D(ConcussiveShotDelay.Position) <= 100
				|| EtherealDelay !== undefined && target.Distance2D(EtherealDelay.Position) <= 100
				|| target.Buffs.some(x => x.Name === "modifier_skywrath_mage_concussive_shot_slow")
			)
			|| target.IsEthereal || target.IsStunned
		) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.MysticFlare))
			return
		} else if (Items.RodofAtos === undefined && !ConcussiveShotAwait.value || target.IsStunned) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.MysticFlare))
			return
		} else if (Items.RodofAtos !== undefined && RodofAtosDelay !== undefined && target.Distance2D(RodofAtosDelay.Position) <= 100 || target.IsStunned) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.MysticFlare))
			return
		} else if (Items.RodofAtos !== undefined && (Items.RodofAtos.Cooldown - 1) && RodofAtosDelay === undefined || target.IsStunned) {
			Abilities.UseMysticFlare(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.MysticFlare))
			return
		}

	}

	// ConcussiveShot
	if (Abilities.ConcussiveShot !== undefined
		&& AutoComboAbility.IsEnabled(Abilities.ConcussiveShot.Name)
		&& Abilities.ConcussiveShot.CanBeCasted()
		&& MyHero.Distance2D(target.Position) <= SmartConShotRadius.value + target.HullRadius) {
		Abilities.ConcussiveShot.UseAbility()
		Sleep.Sleep(Items.Tick)
		return
	}

	// ArcaneBolt
	if (IsValid(Abilities.ArcaneBolt, target, AutoComboAbility)) {
		Abilities.ArcaneBolt.UseAbility(target)
		Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt))
		return
	}

	// Veil
	if (IsValid(Items.Discord, target, AutoComboItems)) {
		Items.Discord.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// Ethereal
	if (
		Items.Ethereal !== undefined
		&& AutoComboItems.IsEnabled(Items.Ethereal.Name)
		&& !Base.CancelAbilityRealm(target)
		&& Items.Ethereal.CanBeCasted()
		&& MyHero.Distance2D(target) <= Items.Ethereal.CastRange
	) {
		Items.Ethereal.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}

	// Dagon
	if (Items.Ethereal === undefined || target.IsEthereal) {
		if (
			Items.Dagon !== undefined
			&& AutoComboItems.IsEnabled("item_dagon_5")
			&& !Base.CancelAbilityRealm(target)
			&& Items.Dagon.CanBeCasted() && MyHero.Distance2D(target) <= Items.Dagon.CastRange
			&& (
				Abilities.AncientSeal === undefined
				|| target.HasBuffByName("modifier_skywrath_mage_ancient_seal")
				|| !AutoComboItems.IsEnabled(Abilities.AncientSeal.Name)
			)
			&& (
				Items.Ethereal === undefined
				|| (target.IsEthereal && !Items.Ethereal.CanBeCasted())
				|| !AutoComboItems.IsEnabled(Items.Ethereal.Name)
			)
		) {
			Items.Dagon.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return
		}
	}
	return
}
export function AutoComboDeleteVars() {
	Sleep.ResetTimer()
}