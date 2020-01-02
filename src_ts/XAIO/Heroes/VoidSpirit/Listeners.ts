import { NearMouse, ComboKey, State } from "./Menu"
import { InitCombo } from "./module/Combo"
import { Unit, Utils, ArrayExtensions } from "wrapper/Imports"
import { RegisterHeroModule, Units } from "XAIO/bootstrap"

RegisterHeroModule("npc_dota_hero_void_spirit", { InitTick })

export function InitTick(unit: Unit) {

	if (!State.value)
		return

	if (!ComboKey.is_pressed)
		return

	InitCombo(
		unit,
		ArrayExtensions.orderBy(
			Units.filter(x => x.IsHero
				&& x.IsEnemy()
				&& x.Distance(Utils.CursorWorldVec) <= NearMouse.value
				&& x.IsAlive),
			x => x.Distance(Utils.CursorWorldVec)
		)[0]
	)
}
