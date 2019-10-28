import { Base } from "../Extends/Helper";
import { HarassKey, HarassMode, State, BladeMailItem } from "../Menu";
import { MouseTarget, Owner } from "../Listeners";
import { Utils, GameSleeper, Unit, Game } from "wrapper/Imports";
import InitAbility from "../Extends/Abilities"

let Sleep = new GameSleeper
function HitAndRun(unit: Unit, mode: boolean = false) {
	Owner.MoveTo(!mode ? Utils.CursorWorldVec : unit.NetworkPosition)
}
export function InitHarass() {
	if (!Base.IsRestrictions(State) || !HarassKey.is_pressed || HarassMode.selected_id === 0) {
		return false
	}
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value && (BladeMailItem.value && target.HasModifier("modifier_item_blade_mail_reflect"))) || !Base.Cancel(target)) {
		Owner.MoveTo(Utils.CursorWorldVec)
		return false
	}
	let Abilities = new InitAbility(Owner),
		Delay = (Owner.SecondsPerAttack * 1000) + (Game.Ping / 2)
	if (HarassMode.selected_id !== 0 && Sleep.Sleeping("Attack")) {
		switch (HarassMode.selected_id) {
			case 1: HitAndRun(target); break;
			case 2: HitAndRun(target, true); break;
		}
		return true
	}

	if (
		Abilities.SearingArrows !== undefined
		&& !Sleep.Sleeping("AttackArrow")
		&& Owner.AttackRange <= Abilities.SearingArrows.CastRange
		&& Abilities.SearingArrows.CanBeCasted()
	) {
		Owner.CastTarget(Abilities.SearingArrows, target)
		Sleep.Sleep(Delay, "AttackArrow")
		return true
	} else if (!Sleep.Sleeping("Attack")) {
		Owner.AttackTarget(target)
		Sleep.Sleep(Delay, "Attack")
		return true
	}
}

export function HarassGameEdned() {
	Sleep.FullReset()
}