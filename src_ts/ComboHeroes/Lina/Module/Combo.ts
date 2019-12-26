//@ts-nocheck
import { Ability, Hero, Flow_t, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner, initItemsMap, initAbilityMap, initHitAndRunMap } from "../Listeners"
import { BladeMailCancel, ComboKeyItem, ModeInvisCombo, State, СomboAbility, СomboItems, StyleCombo, TypeHitAndRun, ComboHitAndRunAttack } from "../Menu"

import ItemsX from "../Extends/Items"
import AbilityX from "../Extends/Abilities"

let Sleep: TickSleeper = new TickSleeper
let ComboActived = false
ComboKeyItem.OnRelease(() => ComboActived = !ComboActived)

function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}
function IsValidItems(Item: Ability, target: Hero) {
	return Item !== undefined && Item.IsReady
		&& Item.CanBeCasted() && СomboItems.IsEnabled(Item.Name)
		&& Owner.Distance2D(target) <= Item.CastRange
}

function abil_someF(abil: Ability, enemy: Hero, Abilities: AbilityX, Items: ItemsX) {
	if (abil === undefined || ((!СomboItems.IsEnabled(abil.Name) || !СomboItems.IsEnabled("item_dagon_5")) && !СomboAbility.IsEnabled(abil.Name)))
		return false

	let abilName = abil.Name,
		DebuffDisable = enemy.ModifiersBook.GetAnyBuffByNames(["modifier_sheepstick_debuff", "modifier_stunned"])

	if (abilName === Abilities?.DragonSlave?.Name) {
		let Prediction = enemy.VelocityWaypoint((abil.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
		if (!Abilities.UseAbility(abil, false, true, Prediction))
			return false
	}
	if (abilName === Items?.Sheeps?.Name) {
		if (DebuffDisable?.IsValid && DebuffDisable?.RemainingTime >= 0.3)
			return false
		if (!Abilities.UseAbility(abil, false, true, enemy))
			return false
	}

	if (abilName === Items?.BlackKingBar?.Name) {
		if (DebuffDisable?.IsValid && DebuffDisable?.RemainingTime >= 0.3)
			return false
		if (!Abilities.UseAbility(abil, true, true, enemy))
			return false
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (!Abilities.UseAbility(abil, true, true))
			return false
	}

	if (!Abilities.UseAbility(abil, false, true, enemy))
		return false
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined || target.IsMagicImmune || !target.IsAlive) {
		return
	}
	if (BladeMailCancel.value && target.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)

	if (Abilities === undefined || Items === undefined || HitAndRun_Unit === undefined)
		return


	if (Owner.Distance2D(target) > Items?.Cyclone?.CastRange) {
		Owner.MoveTo(target.Position)
		Sleep.Sleep(Abilities.Tick)
		return
	}

	if (Owner.IsInvisible) {
		if (ModeInvisCombo.selected_id === 0) {
			if (IsValidAbility(Abilities.LightStrikeArray, target)) {
				let prediction = target.VelocityWaypoint((Abilities.LightStrikeArray.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
				Abilities.UseAbility(Abilities.LightStrikeArray, false, true, prediction)
				return
			}
		}
		return
	}

	if (!target.HasBuffByName("modifier_eul_cyclone")) {
		if (IsValidItems(Items.Cyclone, target)) {
			if (Abilities.LightStrikeArray !== undefined && Abilities.LightStrikeArray.CanBeCasted()) {
				Abilities.UseAbility(Items.Cyclone, false, true, target)
				return
			}
		}

		if (IsValidAbility(Abilities.LightStrikeArray, target) && (Items.Cyclone === undefined || !Items.Cyclone.CanBeCasted())) {
			let prediction = target.VelocityWaypoint((Abilities.LightStrikeArray.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
			Abilities.UseAbility(Abilities.LightStrikeArray, false, true, prediction)
			return
		}
	}

	let abil_some: Ability[] = [
		Items.BlackKingBar,
		Items.Orchid,
		Items.Bloodthorn,
		Items.Shivas,
		Abilities.LagunaBlade,
		Abilities.DragonSlave,
		Items.Dagon,
		Items.Ethereal,
		Items.Discord,
		Items.Sheeps,
	]
	if (abil_some.some(x =>
		!target.IsInvulnerable
		&& x?.CanBeCasted()
		&& abil_someF(x, target, Abilities, Items)))
		return

	if (target.IsInvulnerable)
		return
	if ((!HitAndRun_Unit.ExecuteTo(target, TypeHitAndRun.selected_id) && ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return
	Owner.AttackTarget(target)
}

export function ComboEneded() {
	Sleep.ResetTimer()
}