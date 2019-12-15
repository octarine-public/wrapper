import { Ability, Creep, ExecuteOrder, Hero, LocalPlayer, Menu, Unit, dotaunitorder_t, EntityManager } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MyHero, initAbilityMap } from "../Listeners"
import { SmartConShotFail, SmartConShotOnlyTarget, SmartConShotRadius, State } from "../Menu"

function IChecking(x: Hero | Creep, rad: Menu.Slider) {
	return x.IsAlive && x.IsVisible && MyHero.Distance2D(x) <= rad.value - x.HullRadius
}
let target: Unit
export function OnExecuteOrder(order: ExecuteOrder): boolean {
	if (!Base.IsRestrictions(State) || !SmartConShotFail.value)
		return true
	if (Base.GetPermitPressing)
		return false
	if (
		LocalPlayer === undefined
		|| order.Unit !== LocalPlayer.Hero
		|| order.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
	)
		return true

	let ability = order.Ability as Ability,
		Abilities = initAbilityMap.get(MyHero)
	if (Abilities === undefined)
		return true
	if (ability !== undefined && ability.Name === Abilities.ConcussiveShot.Name) {
		target = SmartConShotOnlyTarget.value
			? EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
				.find(x => IChecking(x, SmartConShotRadius))
			: EntityManager.GetEntitiesByClass<Creep>(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
				.find(x => IChecking(x, SmartConShotRadius))
			|| EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
				.find(x => IChecking(x, SmartConShotRadius))

		if (target === undefined)
			return false
	}
	return true
}
export function WithoutFailDestroy() {
	target = undefined
}