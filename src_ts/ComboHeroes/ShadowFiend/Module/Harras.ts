import { Ability, Menu, Hero, Utils, Unit, Sleeper, Game } from "wrapper/Imports"
import { PredictionRize } from "./Combo"
import { Owner, MouseTarget, initAbilityMap, initHitAndRunMap, initItemsMap } from "../Listeners"
import { State, HarrasKeyItem, ComboHitAndRunAttack, TypeHitAndRun, Menu_Combo_BlinkDistance, HarrasAbility, StyleHarras, BladeMailCancel } from "../Menu"
import { Base } from "../Extends/Helper"

let Target: Hero,
	Sleep = new Sleeper(),
	CastDelay = ((Game.Ping / 2000) + (50 * 2))

let BuffForCheckTarget: string[] = [
	"modifier_item_lotus_orb_active",
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_winter_wyvern_winters_curse",
]
import AbilityX from "../Extends/Abilities"
export let HarrasActived = false
HarrasKeyItem.OnRelease(() => HarrasActived = !HarrasActived)

function ChasingReady(selector: Menu.ImageSelector, ability: Ability, enemy: Unit, Abilities: AbilityX) {
	if (ability === undefined || !selector.IsEnabled(ability.Name) || !ability.CanBeCasted()) {
		return false
	}
	if (PredictionRize(ability, enemy, ability.GetSpecialValue("shadowraze_radius"))) {
		Abilities.UseAbility(ability, true, true)
		return true
	} else if (ability.IsInAbilityPhase && Target.IsMoving) {
		Owner.OrderStop(false)
		Sleep.Sleep(CastDelay, ability)
		return true
	}
	return false
}
export function InitHarras() {
	if (!Base.IsRestrictions(State) || (Target = MouseTarget) === undefined || !Target.IsAlive || Sleep.Sleeping(Target.Index))
		return

	if ((StyleHarras.selected_id === 1 && !HarrasActived) || (StyleHarras.selected_id === 0 && !HarrasKeyItem.is_pressed))
		return

	if (Owner.Distance2D(Target) >= (1175 + 0.75 * (Owner.Speed * 0.5))) { // !isInRange
		Owner.MoveTo(Target.Position)
		Sleep.Sleep(CastDelay, Target.Index)
		return
	}

	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)

	if (Items === undefined || Abilities === undefined || HitAndRun_Unit === undefined)
		return

	if (HarrasAbility.IsEnabled("item_blink")) {
		let blink = Items.Blink
		if (blink && blink.CanBeCasted()) {
			let blinkPos = Target.Position.Extend(Utils.CursorWorldVec, Menu_Combo_BlinkDistance.value)
			if (Owner.Distance2D(blinkPos) > blink.AOERadius)
				blinkPos = Owner.Position.Extend(blinkPos, blink.AOERadius - 1)
			if (Owner.Distance2D(Target) >= Owner.AttackRange)
				Owner.CastPosition(blink, blinkPos)
		}
	}

	let arr_abil: Ability[] = [
		Abilities.Shadowraze1,
		Abilities.Shadowraze2,
		Abilities.Shadowraze3
	]

	if (!Target.IsMagicImmune || !CheckBuffToReflect())
		if (arr_abil.some(abil => !Sleep.Sleeping(abil) && ChasingReady(HarrasAbility, abil, Target, Abilities)))
			return

	if (!Owner.CanAttack(Target) || (!HitAndRun_Unit.ExecuteTo(Target, TypeHitAndRun.selected_id)
		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return
	Owner.AttackTarget(Target)
}

function CheckBuffToReflect() {
	if (BladeMailCancel.value && Target.HasBuffByName("modifier_item_blade_mail_reflect"))
		return true
	return BuffForCheckTarget.some(items => Target.GetBuffByName(items)
		&& items !== "modifier_nyx_assassin_spiked_carapace")
}

export function HarassGameEdned() {
	Target = undefined
	Sleep.FullReset()
}