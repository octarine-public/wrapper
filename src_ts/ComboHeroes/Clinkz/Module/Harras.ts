//@ts-nocheck
import { Utils, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner, initAbilityMap, initHitAndRunMap } from "../Listeners"
import { BladeMailItem, HarrasKey, State, HarrasTypeHitAndRun, HarrasHitAndRunAttack, StyleHarras } from "../Menu"

export let HarrasActived = false
HarrasKey.OnRelease(() => HarrasActived = !HarrasActived)
let Sleep = new TickSleeper()

export function InitHarass() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleHarras.selected_id === 1 && !HarrasActived) || (StyleHarras.selected_id === 0 && !HarrasKey.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value && (BladeMailItem.value && target.HasBuffByName("modifier_item_blade_mail_reflect"))) || !Base.Cancel(target)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350)
		return
	}
	let Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)

	if (Abilities === undefined || HitAndRun_Unit === undefined)
		return

	if (!Owner.CanAttack(target) || (!HitAndRun_Unit.ExecuteTo(target, HarrasTypeHitAndRun.selected_id)
		&& HarrasHitAndRunAttack.value) || !HarrasHitAndRunAttack.value)
		return

	// SearingArrows
	if (
		Abilities.SearingArrows !== undefined
		&& Abilities.SearingArrows.CanBeCasted()
	) {
		Owner.CastTarget(Abilities.SearingArrows, target)
		return
	} else {
		Owner.AttackTarget(target)
		return
	}
}
