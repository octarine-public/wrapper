import { GameSleeper, Utils } from "wrapper/Imports"

import { Base } from "../Extends/Helper"
import { Owner, MouseTarget } from "../Listeners"

import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"

import { State, ComboKeyItem, BladeMailItem, СomboItems, СomboAbility, BlinkRadius } from "../Menu"
import { BreakInit } from "./LinkenBreaker"

let Sleep = new GameSleeper
export function InitCombo() {
	if (Sleep.Sleeping("Delay") || !Base.IsRestrictions(State) || !ComboKeyItem.is_pressed)
		return false
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value && (BladeMailItem.value && target.HasModifier("modifier_item_blade_mail_reflect"))) || !Base.Cancel(target)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		return false
	}
	
	let hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff"),
		Items = new InitItems(Owner),
		Abilities = new InitAbility(Owner),
		comboBreaker = Base.AeonDisc(target)
		
	if (Items.Blink !== undefined
		&& СomboItems.IsEnabled(Items.Blink.Name)
		&& !target.IsInRange(Owner, 600)
		&& Items.Blink.CanBeCasted()) {
		let castRange = Items.Blink.GetSpecialValue("blink_range") + Owner.CastRangeBonus
		Items.Blink.UseAbility(Owner.NetworkPosition.Extend(target.NetworkPosition, Math.min(castRange, Owner.Distance(target) - BlinkRadius.value) - 1))
		Sleep.Sleep(Items.Tick, "Delay")
		return true
	}
	if (!target.IsInRange(Owner, Owner.AttackRange)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		return false
	}
	let blockingAbilities = Base.IsBlockingAbilities(target)
	if (!blockingAbilities) {
		// Hex
		if (
			Items.Sheeps !== undefined
			&& СomboItems.IsEnabled(Items.Sheeps.Name)
			&& Base.CancelItems(target)
			&& Items.Sheeps.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Sheeps.CastRange
			&& !comboBreaker
			&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.3)
		) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Orchid
		if (
			Items.Orchid !== undefined
			&& СomboItems.IsEnabled(Items.Orchid.Name)
			&& Base.CancelItems(target)
			&& Items.Orchid.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Orchid.CastRange
			&& !comboBreaker
			&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.5)
		) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Bloodthorn
		if (
			Items.Bloodthorn !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.Bloodthorn.Name)
			&& Items.Bloodthorn.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Bloodthorn.CastRange
			&& !comboBreaker
		) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Urn
		if (
			Items.UrnOfShadows !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.UrnOfShadows.Name)
			&& Items.UrnOfShadows.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.UrnOfShadows.CastRange
			&& !comboBreaker
			// TODO UrnOfShadows return modifier Name
			&& !target.ModifiersBook.Buffs.some(x => x.Name === Items.UrnOfShadows.Name)
		) {
			Items.UrnOfShadows.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}

		// Vessel
		if (
			Items.SpiritVesel !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.SpiritVesel.Name)
			&& Items.SpiritVesel.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.SpiritVesel.CastRange
			&& !comboBreaker
			// TODO UrnOfShadows return modifier Name
			&& !target.ModifiersBook.Buffs.some(x => x.Name === Items.SpiritVesel.Name)
		) {
			Items.SpiritVesel.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		
		// Medallion
		if (
			Items.Medallion !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.Medallion.Name)
			&& Items.Medallion.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Medallion.CastRange
		) {
			Items.Medallion.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}

		// Solar Crest
		if (
			Items.SolarCrest !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.SolarCrest.Name)
			&& Items.SolarCrest.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.SolarCrest.CastRange
		) {
			Items.SolarCrest.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		
		// RodofAtos
		let atosDebuff = target.ModifiersBook.Buffs.some(x => x.Name === "modifier_rod_of_atos_debuff" && x.RemainingTime > 0.5)
		if (
			Items.RodofAtos !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.RodofAtos.Name)
			&& Items.RodofAtos.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.RodofAtos.CastRange
			&& !atosDebuff
		) {
			Items.RodofAtos.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Nullifier
		if (
			Items.Nullifier !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.Nullifier.Name)
			&& Items.Nullifier.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Nullifier.CastRange
			&& !comboBreaker
			&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.5)
		) {
			Items.Nullifier.UseAbility(target)
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Shivas
		if (
			Items.Shivas !== undefined
			&& Base.CancelItems(target)
			&& СomboItems.IsEnabled(Items.Shivas.Name)
			&& Items.Shivas.CanBeCasted()
			&& Owner.Distance2D(target) <= Items.Shivas.CastRange
		) {
			Items.Shivas.UseAbility()
			Sleep.Sleep(Items.Tick, "Delay")
			return true
		}
		// Strafe
		if (
			Abilities.Strafe !== undefined
			&& СomboAbility.IsEnabled(Abilities.Strafe.Name)
			&& Abilities.Strafe.CanBeCasted()
			&& !comboBreaker
		) {
			Abilities.Strafe.UseAbility()
			Sleep.Sleep(Abilities.Tick, "Delay")
			return true
		}
		// BurningArmy
		if (
			Abilities.BurningArmy !== undefined
			&& СomboAbility.IsEnabled(Abilities.BurningArmy.Name)
			&& Abilities.BurningArmy.CanBeCasted()
			&& !comboBreaker
		) {
			let castRange = Abilities.BurningArmy.CastRange,
				plus = target.Position.Extend(target.InFront(castRange), castRange / 2),
				minus = target.Position.Extend(target.InFront(-castRange), castRange);
			Owner.CastVectorTargetPosition(Abilities.BurningArmy, plus, minus);
			Sleep.Sleep(Abilities.Tick, "Delay")
			return true
		}
	}
	if (blockingAbilities) {
		BreakInit()
		return false
	}
	// SearingArrows
	if (
		Abilities.SearingArrows !== undefined
		&& !Sleep.Sleeping("AttackArrow")
		&& СomboAbility.IsEnabled(Abilities.SearingArrows.Name)
		&& Abilities.SearingArrows.CanBeCasted()
		&& !comboBreaker
	) {
		Owner.CastTarget(Abilities.SearingArrows, target)
		Sleep.Sleep(Owner.SecondsPerAttack * 1000, "AttackArrow")
		return true
	} else 
	if (
		Abilities.SearingArrows !== undefined
		&& !Sleep.Sleeping("Attack")
	) {
		Owner.AttackTarget(target)
		Sleep.Sleep(Owner.SecondsPerAttack * 1000, "Attack")
		return true
	}

	return false
}

export function GameEndedCombo() {
	Sleep.FullReset()
}