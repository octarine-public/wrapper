
import { SmartConShotOnlyTarget, SmartConShotRadius, SmartConShotFail } from "../Menu"
import { ExecuteOrder, Unit, dotaunitorder_t, Ability, skywrath_mage_concussive_shot, Menu, EntityManager, Hero, Creep, LocalPlayer } from "wrapper/Imports"

function IChecking(x: Unit, rad: Menu.Slider, register_unit: Unit) {
	return x.IsAlive && x.IsVisible && register_unit.Distance2D(x) <= rad.value - x.HullRadius
}

export function WithoutFail(order: ExecuteOrder): boolean {

	if (!SmartConShotFail.value
		|| order.Unit !== LocalPlayer?.Hero
		|| order.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET)
		return true

	let ability = order.Ability as Ability
	if (ability === undefined || !(ability instanceof skywrath_mage_concussive_shot))
		return true

	let target = SmartConShotOnlyTarget.value ?
		EntityManager.GetEntitiesByClass(Hero)
			.find(x => x.IsEnemy() && IChecking(x, SmartConShotRadius, order.Unit!))
		: EntityManager.GetEntitiesByClass(Creep)
			.find(x => x.IsEnemy() && IChecking(x, SmartConShotRadius, order.Unit!))
		|| EntityManager.GetEntitiesByClass(Hero)
			.find(x => x.IsEnemy() && IChecking(x, SmartConShotRadius, order.Unit!))

	return target !== undefined
}