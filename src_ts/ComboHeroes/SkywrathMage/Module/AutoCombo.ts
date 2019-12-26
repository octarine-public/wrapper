//@ts-nocheck
import { Combo } from "./Combo"
import { Base } from "../Extends/Helper"
import { BreakInit } from "./LinkenBreaker"
import { Ability, ArrayExtensions, Hero, EntityManager } from "wrapper/Imports"
import { MyHero, initItemsMap, initAbilityMap, initItemsTargetMap, initHitAndRunMap, ProjectileTrigger } from "../Listeners"
import {
	AutoComboAbility, AutoComboItems, AutoComboDisableWhen, AutoComboMinHPpercent,
	AutoComboState, ComboKey, State, TypeHitAndRun, ComboHitAndRunAttack, BladeMailCancelCombo,
	HitAndRunAutoCombo
} from "../Menu"


export function AutoCombo() {

	if (!Base.IsRestrictions(State) || !AutoComboState.value)
		return

	if (AutoComboDisableWhen.value && ComboKey.is_pressed)
		return

	let enemyLoser = ArrayExtensions.orderBy(
		EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).filter(x =>
			x.IsAlive
			&& !x.IsIllusion
			&& !x.IsMagicImmune
			&& Base.Active(x)
			&& (x.IsStunned || Base.TriggerAutoCombo(x) || ProjectileTrigger)
			&& x.Distance2D(MyHero) <= 1200
		), x => x.Distance2D(MyHero))[0]

	if (enemyLoser === undefined || !Base.Cancel(enemyLoser)
		|| (BladeMailCancelCombo.value && enemyLoser.HasBuffByName("modifier_item_blade_mail_reflect")))
		return

	if (enemyLoser.HPPercent > AutoComboMinHPpercent.value && AutoComboMinHPpercent.value !== 0)
		return

	if (Base.IsLinkensProtected(enemyLoser)) {
		BreakInit()
		return
	}
	let Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero),
		ItemsTarget = initItemsTargetMap.get(enemyLoser),
		HitAndRun_Unit = initHitAndRunMap.get(MyHero)

	if (Items === undefined || Abilities === undefined)
		return

	let AbilityArray: Ability[] = [
		Items.Blink,
		Items.Sheeps,
		Items.RodofAtos,
		Items.ClumsyNet,
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

	if (AbilityArray.some(x => x?.CanBeCasted() && Combo(x, enemyLoser, Abilities, Items, ItemsTarget, AutoComboItems, AutoComboAbility, HitAndRunAutoCombo.value)))
		return
	if (!HitAndRunAutoCombo.value)
		return
	if ((!HitAndRun_Unit.ExecuteTo(enemyLoser, TypeHitAndRun.selected_id) && ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return

	MyHero.AttackTarget(enemyLoser)
}