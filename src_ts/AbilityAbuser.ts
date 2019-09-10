import { EntityManager, EventsSDK, Hero, LocalPlayer, Menu } from "./wrapper/Imports"
let AbilityAbuser = Menu.AddEntry(["Utility", "Ability Abuse"]),
	ability_abuse = AbilityAbuser.AddKeybind("Hold key"),
	ability_abuse_selector = AbilityAbuser.AddImageSelector("Ability Abuse Selector", [
		"witch_doctor_voodoo_restoration",
		"invoker_exort",
	])

EventsSDK.on("Tick", () => {
	if (!ability_abuse.is_pressed)
		return false
	EntityManager.AllEntities.filter(ent => ent instanceof Hero && ent.IsControllableByPlayer(LocalPlayer.PlayerID)).forEach((MyEnt: Hero) => {
		if (MyEnt.IsStunned)
			return
		let repeated_unit = new Array<C_BaseEntity>(0x80/*max: 0x3FFF*/).fill(MyEnt.m_pBaseEntity)
		let ability = ability_abuse_selector.IsEnabled("witch_doctor_voodoo_restoration") ? MyEnt.GetAbilityByName("witch_doctor_voodoo_restoration") : undefined
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
		if (ability_abuse_selector.IsEnabled("invoker_exort"))
			ability = MyEnt.GetAbilityByName("invoker_exort")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
	})
})