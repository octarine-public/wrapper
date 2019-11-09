// import { EventsSDK, Hero, Menu, TrackingProjectile, Ability, ArrayExtensions, TickSleeper } from "wrapper/Imports";

// let all_units: Hero[] = [],
// 	proj_list: TrackingProjectile[] = []

// let MenuTree = Menu.AddEntry(["Utility", "Dodger"])
// let MenuState = MenuTree.AddToggle("State", true)
// var abils: Array<{
// 	abil_name: string | RegExp
// 	abil?: Ability
// }> = [
// 		{
// 			abil_name: "antimage_counterspell",
// 		},
// 		{
// 			abil_name: "item_cyclone",
// 		},
// 	]
// let Sleep = new TickSleeper
// function GetAvailableAbils(unit: Hero) {
// 	return abils.filter(
// 		abilData => abilData.abil_name instanceof RegExp
// 			|| abilData.abil_name.startsWith("item_")
// 			|| unit.GetAbilityByName(abilData.abil_name) !== undefined,
// 	)
// }

// EventsSDK.on("Tick", () => {
// 	if (!MenuState.value || Sleep.Sleeping) {
// 		return
// 	}
// 	all_units.filter(unit => {
// 		if (!unit.IsControllable && !unit.IsHero || unit.IsEnemy()) {
// 			return
// 		}
// 		let availableAbils = GetAvailableAbils(unit).filter(abilData => {
// 			let abil = abilData.abil = unit.GetAbilityByName(abilData.abil_name) || unit.GetItemByName(abilData.abil_name)
// 			return abil !== undefined && !abil.IsHidden
// 		})
// 		let ability = availableAbils.find(x => x !== undefined && x.abil.CanBeCasted())
// 		if (ability !== undefined) {
// 			proj_list.filter(x => {
// 				let delay = 0
// 				if (ability.abil.CastPoint <= 0) {
// 					delay = 0.2
// 				}
// 				if (unit.Distance(x.Position) <= (GetLatency(Flow_t.OUT) * 1000) + 230) {
// 					ability.abil.UseAbility(unit)
// 					Sleep.Sleep(((delay * 2) * 1000) + 30)
// 					return
// 				}
// 			})
// 		}
// 	})
// })
