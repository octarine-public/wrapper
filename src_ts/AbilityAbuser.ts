import { Ability, EntityManager, Hero, Menu, item_blade_mail, puck_phase_shift, EventsSDK } from "./wrapper/Imports"
let AbilityAbuser = Menu.AddEntry(["Utility", "Ability Abuse"]),
	ability_abuse = AbilityAbuser.AddKeybind("Hold key"),
	ability_abuse_selector = AbilityAbuser.AddImageSelector("Ability Abuse Selector", [
		"item_blade_mail",
		"puck_phase_shift",
	])

EventsSDK.on("Tick", () => {
	if (!ability_abuse.is_pressed)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(MyEnt => {
		if (!MyEnt.IsControllable || MyEnt.IsStunned)
			return
		let ability: Nullable<Ability>
		if (ability_abuse_selector.IsEnabled("item_blade_mail"))
			ability = MyEnt.GetItemByClass(item_blade_mail)
		if (ability !== undefined && ability.CanBeCasted()) {
			MyEnt.CastNoTarget(ability)
			return false
		}
		if (ability_abuse_selector.IsEnabled("puck_phase_shift"))
			ability = MyEnt.GetAbilityByClass(puck_phase_shift)
		if (ability !== undefined && ability.CanBeCasted()) {
			MyEnt.CastNoTarget(ability)
			return false
		}
	})
})
