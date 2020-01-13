import { NearMouse } from "./Menu"
import { InitCombo } from "./module/Combo"
import { Unit, ArrayExtensions, Input } from "wrapper/Imports"
import { RegisterHeroModule, Units } from "XAIO/bootstrap"

RegisterHeroModule("npc_dota_hero_lina", { InitTick })

let near_enemy: Nullable<Unit>

export function InitTick(unit: Unit) {
	near_enemy = ArrayExtensions.orderBy(
		Units.filter(x => x.IsHero
			&& x.IsEnemy()
			&& x.Distance(Input.CursorOnWorld) <= NearMouse.value
			&& x.IsAlive),
		x => x.Distance(Input.CursorOnWorld)
	)[0]

	// console.log(unit.Name)

	InitCombo(unit, near_enemy)
}
