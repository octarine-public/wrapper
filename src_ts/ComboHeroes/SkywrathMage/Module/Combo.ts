import { GameSleeper, Utils } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero, ProjList } from "../Listeners"
import { AbilityMenu, AutoAttackTarget, BladeMailCancelCombo, BlinkRadius, ComboKey, Items, MinHealthToUltItem, State, ConcussiveShotAwait } from "../Menu"
import { BreakInit } from "./LinkenBreaker"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"

let Sleep = new GameSleeper
export function InitCombo() {
	if (!Base.IsRestrictions(State) || !ComboKey.is_pressed || Sleep.Sleeping("Delay"))
		return false
	let target = MouseTarget
	if (target === undefined) {
		MyHero.MoveTo(Utils.CursorWorldVec)
		return false
	}
	if (BladeMailCancelCombo.value && target.HasModifier("modifier_item_blade_mail_reflect")) {
		return false
	}
	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero),
		ItemsTarget = new InitItems(target)


	let RodofAtosDelay = ProjList.find(x => x.ParticlePath === "particles/items2_fx/rod_of_atos_attack.vpcf"),
		EtherealDelay = ProjList.find(x => x.ParticlePath === "particles/items_fx/ethereal_blade.vpcf"),
		ConcussiveShotDelay = ProjList.find(x => x.ParticlePath === "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf")
			
	// if (RodofAtosDelay !== undefined)
	// 	console.log(target.Distance2D(RodofAtosDelay.Position))
		
	if (ItemsInit.Blink !== undefined
		&& Items.IsEnabled(ItemsInit.Blink.Name)
		&& Base.CancelAbilityRealm(target)
		&& !target.IsInRange(MyHero, 600)
		&& ItemsInit.Blink.CanBeCasted()) {
		// blink c+v :roflanpominki:
		let castRange = ItemsInit.Blink.GetSpecialValue("blink_range") + MyHero.CastRangeBonus
		ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.NetworkPosition, Math.min(castRange, MyHero.Distance(target) - BlinkRadius.value) - 1))
		Sleep.Sleep(ItemsInit.Tick, "Delay")
		return true
	}

	if (Base.Cancel(target) && Base.StartCombo(target)) {

		if (Base.IsLinkensProtected(target)) {
			BreakInit()
			return false
		}

		var comboBreaker = Base.AeonDisc(target),
			//stunDebuff = target.Modifiers.FirstOrDefault(x => x.IsStunDebuff),
			hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff")

		// Hex
		if (ItemsInit.Sheeps !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Sheeps.Name)
			&& ItemsInit.Sheeps.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Sheeps.CastRange
			&& !comboBreaker
			&& !target.IsStunned
			&& (hexDebuff === undefined || !hexDebuff.IsValid || hexDebuff.RemainingTime <= 0.3))
		{
			ItemsInit.Sheeps.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// Orchid
		if (ItemsInit.Orchid !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Orchid.Name)
			&& ItemsInit.Orchid.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Orchid.CastRange
			&& !comboBreaker)
		{
			ItemsInit.Orchid.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// Bloodthorn
		if (ItemsInit.Bloodthorn !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Bloodthorn.Name)
			&& ItemsInit.Bloodthorn.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Bloodthorn.CastRange
			&& !comboBreaker)
		{
			ItemsInit.Bloodthorn.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// AncientSeal
		if (Abilities.AncientSeal !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& AbilityMenu.IsEnabled(Abilities.AncientSeal.Name)
			&& Abilities.AncientSeal.CanBeCasted()
			&& MyHero.Distance2D(target) <= Abilities.AncientSeal.CastRange
			&& !comboBreaker) {
			Abilities.AncientSeal.UseAbility(target)
			Sleep.Sleep(Abilities.Tick, "Delay")
			return true
		}

		// RodofAtos
		let atosDebuff = target.Buffs.some(x => x.IsValid && x.Name === "modifier_rod_of_atos_debuff" && x.RemainingTime > 0.5)
		if (ItemsInit.RodofAtos !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.RodofAtos.Name)
			&& ItemsInit.RodofAtos.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.RodofAtos.CastRange
			&& !atosDebuff) {
			ItemsInit.RodofAtos.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// MysticFlare
		if (Abilities.MysticFlare !== undefined
			&& AbilityMenu.IsEnabled(Abilities.MysticFlare.Name)
			&& MinHealthToUltItem.value <= target.HPPercent
			&& Abilities.MysticFlare.CanBeCasted()
			&& MyHero.Distance2D(target) <= (Abilities.MysticFlare.CastRange - 100)
			&& !comboBreaker
			&& (Base.BadUlt(target) || Base.Active(target))
		){
			if (ItemsInit.RodofAtos === undefined 
				&& ConcussiveShotAwait.value
				&& Abilities.ConcussiveShot !== undefined 
				&& (ConcussiveShotDelay !== undefined && target.Distance2D(ConcussiveShotDelay.Position) <= 100
				|| EtherealDelay !== undefined && target.Distance2D(EtherealDelay.Position) <= 100)
				|| target.IsEthereal
			)
			{
				Abilities.UseMysticFlare(target)
				Sleep.Sleep(Abilities.Tick, "Delay")
				return true
			} else if (ItemsInit.RodofAtos === undefined && !ConcussiveShotAwait.value) {
				Abilities.UseMysticFlare(target)
				Sleep.Sleep(Abilities.Tick, "Delay")
				return true
			} else if (ItemsInit.RodofAtos !== undefined && RodofAtosDelay !== undefined && target.Distance2D(RodofAtosDelay.Position) <= 100) {
				Abilities.UseMysticFlare(target)
				Sleep.Sleep(Abilities.Tick, "Delay")
				return true
			} else if (ItemsInit.RodofAtos !== undefined && (ItemsInit.RodofAtos.Cooldown - 1) && RodofAtosDelay === undefined) {
				Abilities.UseMysticFlare(target)
				Sleep.Sleep(Abilities.Tick, "Delay")
				return true
			}
		}

		// Nullifier
		if (ItemsInit.Nullifier !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Nullifier.Name)
			&& ItemsInit.Nullifier.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Nullifier.CastRange
			&& !comboBreaker)
		{
			if (ItemsTarget.AeonDisk === undefined) {
				ItemsInit.Nullifier.UseAbility(target)
				Sleep.Sleep(ItemsInit.Tick, "Delay")
				return true
			} else if (ItemsTarget.AeonDisk !== undefined && target.HPPercent <= 70) {
				ItemsInit.Nullifier.UseAbility(target)
				Sleep.Sleep(ItemsInit.Tick, "Delay")
				return true
			} else if (ItemsTarget.AeonDisk !== undefined && !ItemsTarget.AeonDisk.CanBeCasted()) {
				Abilities.UseMysticFlare(target)
				Sleep.Sleep(ItemsInit.Tick, "Delay")
				return true
			}
		}

		// Veil
		if (ItemsInit.Discord !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Discord.Name)
			&& ItemsInit.Discord.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Discord.CastRange) {
			ItemsInit.Discord.UseAbility(target.Position)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// Ethereal
		if (ItemsInit.Ethereal !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.Ethereal.Name)
			&& ItemsInit.Ethereal.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Ethereal.CastRange
			&& !comboBreaker)
		{
			ItemsInit.Ethereal.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// Shivas
		if (ItemsInit.Shivas !== undefined
			&& Items.IsEnabled(ItemsInit.Shivas.Name)
			&& ItemsInit.Shivas.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Shivas.CastRange) {
			ItemsInit.Shivas.UseAbility()
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}
		// ConcussiveShot
		if (Abilities.ConcussiveShot !== undefined
			&& AbilityMenu.IsEnabled(Abilities.ConcussiveShot.Name)
			//&& Base.ConcussiveShotTarget(target, Abilities.ConcussiveShot.TargetHit)
			&& Abilities.ConcussiveShot.CanBeCasted()
			&& MyHero.Distance2D(target) <= Abilities.ConcussiveShot.CastRange) {
			Abilities.ConcussiveShot.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ConcussiveShot), "Delay")
			return true
		}
		// ArcaneBolt
		if (Abilities.ArcaneBolt !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& AbilityMenu.IsEnabled(Abilities.ArcaneBolt.Name)
			&& Abilities.ArcaneBolt.CanBeCasted()
			&& MyHero.Distance2D(target) <= Abilities.ArcaneBolt.CastRange)
		{
			Abilities.ArcaneBolt.UseAbility(target)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt), "Delay")
			return true
		}

		// Dagon
		if (ItemsInit.Dagon !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled("item_dagon_5")
			&& ItemsInit.Dagon.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Dagon.CastRange
			&& !comboBreaker)
		{
			ItemsInit.Dagon.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// UrnOfShadows
		if (ItemsInit.UrnOfShadows !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.UrnOfShadows.Name)
			&& ItemsInit.UrnOfShadows.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.UrnOfShadows.CastRange
			&& !comboBreaker)
		{
			ItemsInit.UrnOfShadows.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}

		// SpiritVessel
		if (ItemsInit.SpiritVesel !== undefined
			&& !Base.CancelAbilityRealm(target)
			&& Items.IsEnabled(ItemsInit.SpiritVesel.Name)
			&& ItemsInit.SpiritVesel.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.SpiritVesel.CastRange
			&& !comboBreaker)
		{
			ItemsInit.SpiritVesel.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, "Delay")
			return true
		}
		if (AutoAttackTarget.value && MyHero.CanAttack(target)
			&& !Sleep.Sleeping("Attack")
			&& !Base.CancelAbilityRealm(target)) {
			MyHero.AttackTarget(target)
			Sleep.Sleep(MyHero.SecondsPerAttack * 1000, "Attack")
			return true
		}
	}
}
export function ComboDeleteVarsTemp(){
	Sleep.FullReset()
}