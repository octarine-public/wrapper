import { Ability, EntityManager, EventsSDK, Hero, LocalPlayer, Menu } from "./wrapper/Imports"
let AbilityAbuser = Menu.AddEntry(["Utility", "Ability Abuse"]),
	ability_abuse = AbilityAbuser.AddKeybind("Hold key"),
	ability_abuse_selector = AbilityAbuser.AddImageSelector("Ability Abuse Selector", [
		"invoker_invoke",
		"invoker_exort",
		"invoker_quas",
		"invoker_wex",
		"skywrath_mage_concussive_shot",
		"item_shivas_guard",
	])

setInterval(() => {
	if (!ability_abuse.is_pressed)
		return false
	EntityManager.AllEntities.filter(ent => ent instanceof Hero && ent.IsControllable).forEach((MyEnt: Hero) => {
		if (MyEnt.IsStunned)
			return
		let repeated_unit = new Array<C_BaseEntity>(0x80/*0x80*//*max: 0x3FFF*/).fill(MyEnt.m_pBaseEntity)
		let ability: Ability
		if (ability_abuse_selector.IsEnabled("invoker_invoke"))
			ability = MyEnt.GetAbilityByName("invoker_invoke")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders ({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
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
			PrepareUnitOrders ({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
		if (ability_abuse_selector.IsEnabled("invoker_quas"))
			ability = MyEnt.GetAbilityByName("invoker_quas")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders ({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
		if (ability_abuse_selector.IsEnabled("invoker_wex"))
			ability = MyEnt.GetAbilityByName("invoker_wex")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders ({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
		if (ability_abuse_selector.IsEnabled("skywrath_mage_concussive_shot"))
			ability = MyEnt.GetAbilityByName("skywrath_mage_concussive_shot")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders ({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return false
		}
		if (ability_abuse_selector.IsEnabled("item_shivas_guard"))
			ability = MyEnt.GetItemByName("item_shivas_guard")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders ({
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
}, 100)