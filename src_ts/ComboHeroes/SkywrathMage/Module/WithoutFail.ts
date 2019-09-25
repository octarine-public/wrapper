import { Ability, Creep, ExecuteOrder, Hero, LocalPlayer, Menu, Unit } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Creeps, Heroes, MyHero } from "../Listeners"
import { SmartConShotFail, SmartConShotOnlyTarget, SmartConShotRadius, State } from "../Menu"

function IChecking(MyHero: Hero, x: Hero | Creep, rad: Menu.Slider) {
	return x.IsAlive && x.IsVisible && MyHero.Distance2D(x) <= rad.value - x.HullRadius
}
import InitAbility from "../Extends/Abilities"

let target: Unit

export function OnExecuteOrder(order: ExecuteOrder): boolean {
	if (!Base.IsRestrictions(State) || !SmartConShotFail.value) {
		return true
	}
	if (Base.GetPermitPressing) {
		return false
	}
	let SkyWrath = LocalPlayer
	if (SkyWrath !== undefined) {
		if (order.Unit === LocalPlayer.Hero) {
			if (order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET) {
				let Ability = order.Ability as Ability,
					Abilities = new InitAbility(MyHero)
				if (Ability !== undefined && Ability.Name === Abilities.ConcussiveShot.Name) {
					target = SmartConShotOnlyTarget.value
						? Heroes.find(x => x.IsEnemy() && IChecking(MyHero, x, SmartConShotRadius))
						: Creeps.find(x => x.IsEnemy() && IChecking(MyHero, x, SmartConShotRadius)) || Heroes.find(x => x.IsEnemy() && IChecking(MyHero, x, SmartConShotRadius))
					if (target === undefined) {
						return false
					}
				}
			}
		}
	}
	return true
}
export function WithoutFailDestroy() {
	target = undefined
}