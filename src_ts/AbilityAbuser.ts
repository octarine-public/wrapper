import { EntityManager, EventsSDK, Hero, LocalPlayer, Menu } from "./wrapper/Imports"
let AbilityAbuser = Menu.AddEntry(["Utility", "Ability | Items Abuse"]),
	ability_abuse = AbilityAbuser.AddKeybind("Hold key"),
	ability_abuse_selector = AbilityAbuser.AddImageSelector("Ability Abuse Selector", [
	"witch_doctor_voodoo_restoration",
	"medusa_mana_shield",
	"invoker_exort",
	"bristleback_quill_spray",
	"queenofpain_scream_of_pain",
	"item_shadow_amulet",
	"item_shivas_guard",
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
		if (ability_abuse_selector.IsEnabled("medusa_mana_shield"))
			ability = MyEnt.GetAbilityByName("medusa_mana_shield")
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
		if (ability_abuse_selector.IsEnabled("bristleback_quill_spray"))
			ability = MyEnt.GetAbilityByName("bristleback_quill_spray")
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
		if (ability_abuse_selector.IsEnabled("queenofpain_scream_of_pain"))
			ability = MyEnt.GetAbilityByName("queenofpain_scream_of_pain")
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
		if (ability_abuse_selector.IsEnabled("item_shivas_guard"))
			ability = MyEnt.GetItemByName("item_shivas_guard")
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
		if (ability_abuse_selector.IsEnabled("item_shadow_amulet"))
			ability = MyEnt.GetItemByName("item_shadow_amulet")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_SELECTED_UNITS,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
				Target: MyEnt.m_pBaseEntity,
			})
			return false
		}
	})
})