import { GameSleeper, TickSleeper, Utils, Ability, Hero, Menu } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero, ProjList, initItemsMap, initAbilityMap, initItemsTargetMap, initHitAndRunMap } from "../Listeners"
import { AbilityMenu, BladeMailCancelCombo, BlinkRadius, TypeHitAndRun, ComboHitAndRunAttack, ComboKey, ConcussiveShotAwait, Items as ItemsMenu, State, StyleCombo } from "../Menu"
import { BreakInit } from "./LinkenBreaker"

import ItemsX from "../Extends/Items"
import AbilityX from "../Extends/Abilities"

let Sleep = new TickSleeper
let GameSleep = new GameSleeper

export let ComboActived = false
ComboKey.OnRelease(() => ComboActived = !ComboActived)

export function Combo(
	abil: Ability,
	enemyLoser: Hero,
	Abilities: AbilityX,
	ItemsX: ItemsX,
	ItemsEnemy: ItemsX,
	ItemsMenu: Menu.ImageSelector,
	AbilityMenu: Menu.ImageSelector
) {

	if (abil === undefined || (!ItemsMenu.IsEnabled(abil.Name) && !AbilityMenu.IsEnabled(abil.Name) && !ItemsMenu.IsEnabled("item_dagon_5")))
		return false

	let abilName = abil.Name
	let ClumsyDelay = ProjList.find(x => x.ParticlePath === "particles/items5_fx/clumsy_net_proj.vpcf"),
		RodofAtosDelay = ProjList.find(x => x.ParticlePath === "particles/items2_fx/rod_of_atos_attack.vpcf"),
		EtherealDelay = ProjList.find(x => x.ParticlePath === "particles/items_fx/ethereal_blade.vpcf"),
		ConcussiveShotDelay = ProjList.find(x => x.ParticlePath === "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf")
	let comboBreaker = Base.AeonDisc(enemyLoser),
		sheepDebuff = enemyLoser.GetBuffByName("modifier_sheepstick_debuff"),
		atosDebuff = enemyLoser.GetBuffByName("modifier_rod_of_atos_debuff"),
		ClumsyDebuff = enemyLoser.GetBuffByName("modifier_clumsy_net_ensnare")

	if (abilName === ItemsX?.Blink?.Name) {
		let castRange = abil.GetSpecialValue("blink_range") + MyHero.CastRangeBonus
		if (!Abilities.UseAbility(abil, false, MyHero.Position.Extend(enemyLoser.Position, Math.min(castRange, MyHero.Distance(enemyLoser) - BlinkRadius.value) - 1)))
			return false
	}

	if (MyHero.Distance2D(enemyLoser) > abil.CastRange)
		return false

	if (abilName === ItemsX?.ClumsyNet?.Name) {
		if (ClumsyDebuff?.IsValid && ClumsyDebuff?.RemainingTime >= 0.5)
			return false
		if (!Abilities.UseAbility(abil, false, enemyLoser))
			return false
	}

	if (abilName === ItemsX?.RodofAtos?.Name) {
		if (atosDebuff?.IsValid && atosDebuff?.RemainingTime >= 0.5)
			return false
		if (!Abilities.UseAbility(abil, false, enemyLoser))
			return false
	}

	if (abilName === ItemsX?.Sheeps?.Name) {
		if (sheepDebuff?.IsValid && sheepDebuff?.RemainingTime >= 0.3)
			return false
		if (!Abilities.UseAbility(abil, false, enemyLoser) && comboBreaker)
			return false
	}

	if (abilName === Abilities?.MysticFlare?.Name) {
		if (comboBreaker && (!Base.BadUlt(enemyLoser) || !Base.Active(enemyLoser)))
			return false
		if (ItemsX.RodofAtos === undefined
			&& ConcussiveShotAwait.value
			&& Abilities.ConcussiveShot !== undefined
			&& (ConcussiveShotDelay !== undefined && enemyLoser.Distance2D(ConcussiveShotDelay.Position) <= 100
				|| EtherealDelay !== undefined && enemyLoser.Distance2D(EtherealDelay.Position) <= 100
				|| enemyLoser.Buffs.some(x => x.Name === "modifier_skywrath_mage_concussive_shot_slow"))
			|| enemyLoser.IsEthereal
		) {
			if (!Abilities.UseMysticFlare(abil, enemyLoser))
				return false
		} else if (ItemsX.RodofAtos === undefined
			&& !ConcussiveShotAwait.value) {
			if (!Abilities.UseMysticFlare(abil, enemyLoser))
				return false
		} else if (ItemsX.RodofAtos === undefined
			&& ClumsyDelay !== undefined
			&& enemyLoser.Distance2D(ClumsyDelay.Position) <= 100
		) {
			if (!Abilities.UseMysticFlare(abil, enemyLoser))
				return false
		} else if (ItemsX.RodofAtos !== undefined
			&& RodofAtosDelay !== undefined
			&& enemyLoser.Distance2D(RodofAtosDelay.Position) <= 100
		) {
			if (!Abilities.UseMysticFlare(abil, enemyLoser))
				return false
		} else if (ItemsX.RodofAtos !== undefined
			&& (ItemsX.RodofAtos.Cooldown - 1)
			&& RodofAtosDelay === undefined
		) {
			if (!Abilities.UseMysticFlare(abil, enemyLoser))
				return false
		}
	}

	if (abilName === ItemsX?.Nullifier?.Name) {
		if (ItemsEnemy.AeonDisk === undefined) {
			if (!Abilities.UseAbility(abil, false, enemyLoser) && comboBreaker)
				return false
		} else if (ItemsEnemy.AeonDisk !== undefined && enemyLoser.HPPercent <= 70) {
			if (!Abilities.UseAbility(abil, false, enemyLoser) && comboBreaker)
				return false
		} else {
			if (!Abilities.UseAbility(abil, false, enemyLoser) && comboBreaker)
				return false
		}
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (!Abilities.UseAbility(abil, true))
			return false
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET)) {
		if (!Abilities.UseAbility(abil, false, enemyLoser))
			return false
	}
	if (!Abilities.UseAbility(abil, false, enemyLoser))
		return false
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKey.is_pressed))
		return
	let enemyLoser = MouseTarget
	if (enemyLoser === undefined) {
		MyHero.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350)
		return
	}
	if (BladeMailCancelCombo.value && enemyLoser.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	let Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero),
		ItemsTarget = initItemsTargetMap.get(enemyLoser),
		HitAndRun_Unit = initHitAndRunMap.get(MyHero)

	if (!MyHero?.IsInRange(enemyLoser, 1200)) {
		MyHero.MoveTo(enemyLoser?.Position)
		Sleep.Sleep(350)
		return
	}

	if (Items === undefined || Abilities === undefined || ItemsTarget === undefined)
		return

	let AbilityArray: Ability[] = [
		Items.Blink,
		Items.Sheeps,
		Items.RodofAtos,
		Items.Orchid,
		Items.Bloodthorn,
		Items.Discord,
		Items.Ethereal,
		Abilities.AncientSeal,
		Items.Dagon,
		Abilities.MysticFlare,
		Items.Nullifier,
		Items.Shivas,
		Abilities.ConcussiveShot,
		Abilities.ArcaneBolt,
		Items.UrnOfShadows,
		Items.SpiritVesel
	]

	if (Base.Cancel(enemyLoser) && Base.StartCombo(enemyLoser)) {
		if (Base.IsLinkensProtected(enemyLoser)) {
			BreakInit()
			return
		}

		if (AbilityArray.some(x => x?.CanBeCasted() && Combo(x, enemyLoser, Abilities, Items, ItemsTarget, ItemsMenu, AbilityMenu)))
			return

		if ((!HitAndRun_Unit.ExecuteTo(enemyLoser, TypeHitAndRun.selected_id) && ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
			return
		MyHero.AttackTarget(enemyLoser)
		return
	}
}
export function ComboDeleteVarsTemp() {
	Sleep.ResetTimer()
	GameSleep.FullReset()
}