//@ts-nocheck
import { GameSleeper, TickSleeper, Utils } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner, initAbilityMap, initItemsMap, initHitAndRunMap } from "../Listeners"
import { BladeMailItem, BlinkRadius, ComboKeyItem, State, СomboAbility, СomboItems, StyleCombo, ComboHitAndRunAttack, TypeHitAndRun } from "../Menu"
import { BreakInit } from "./LinkenBreaker"

let Sleep = new TickSleeper(),
	GameSleep = new GameSleeper()
export let ComboActived = false
ComboKeyItem.OnRelease(() => ComboActived = !ComboActived)

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value && (BladeMailItem.value && target.HasBuffByName("modifier_item_blade_mail_reflect"))) || !Base.Cancel(target)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350)
		return
	}
	let hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff"),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)

	if (Abilities === undefined || Items === undefined || HitAndRun_Unit === undefined)
		return

	let comboBreaker = Base.AeonDisc(target)
	if (Items.Blink !== undefined
		&& СomboItems.IsEnabled(Items.Blink.Name)
		&& !target.IsInRange(Owner, 600)
		&& Items.Blink.CanBeCasted()) {
		let castRange = Items.Blink.GetSpecialValue("blink_range") + Owner.CastRangeBonus
		Items.Blink.UseAbility(Owner.Position.Extend(target.Position, Math.min(castRange, Owner.Distance(target) - BlinkRadius.value) - 1))
		Sleep.Sleep(Items.Tick)
		return
	}
	if (!target.IsInRange(Owner, Owner.AttackRange)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350)
		return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
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
			Sleep.Sleep(Items.Tick)
			return
		}
		// Strafe
		// if (
		// 	Abilities.Strafe !== undefined
		// 	&& СomboAbility.IsEnabled(Abilities.Strafe.Name)
		// 	&& Abilities.Strafe.CanBeCasted()
		// 	&& !comboBreaker
		// ) {
		// 	Abilities.Strafe.UseAbility()
		// 	Sleep.Sleep(Abilities.Tick)
		// 	return
		// }
		// BurningArmy
		if (
			Abilities.BurningArmy !== undefined
			&& СomboAbility.IsEnabled(Abilities.BurningArmy.Name)
			&& Abilities.BurningArmy.CanBeCasted()
			&& !comboBreaker
		) {
			let castRange = Abilities.BurningArmy.CastRange,
				plus = target.Position.Extend(target.InFront(castRange), castRange / 2),
				minus = target.Position.Extend(target.InFront(-castRange), castRange)
			Owner.CastVectorTargetPosition(Abilities.BurningArmy, plus, minus)
			Sleep.Sleep(Abilities.Tick)
			return
		}
	}
	if (blockingAbilities) {
		BreakInit()
		return
	}

	if (!Owner.CanAttack(target) || (!HitAndRun_Unit.ExecuteTo(target, TypeHitAndRun.selected_id)
		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return

	// SearingArrows
	if (
		Abilities.SearingArrows !== undefined
		&& СomboAbility.IsEnabled(Abilities.SearingArrows.Name)
		&& Abilities.SearingArrows.CanBeCasted()
	) {
		Owner.CastTarget(Abilities.SearingArrows, target)
		return
	} else {
		Owner.AttackTarget(target)
		return
	}
}

export function GameEndedCombo() {
	Sleep.ResetTimer()
	GameSleep.FullReset()
}