// import { EventsSDK, Unit, Menu, TrackingProjectile, Ability, ArrayExtensions, LocalPlayer } from "wrapper/Imports";

// let all_units: Unit[] = [],
// 	proj_list: TrackingProjectile[] = []

// let MenuTree = Menu.AddEntry(["Utility", "Dodger"])
// let MenuState = MenuTree.AddToggle("State", true)
// var abils: Array<{
// 	abil_name: string | RegExp
// 	abil?: Ability
// }> = [
// 	{
// 		abil_name: "antimage_counterspell",
// 	},
// ]

// function GetAvailableAbils() {
// 	var MyEnt = LocalPlayer.Hero
// 	return abils.filter(
// 		abilData => abilData.abil_name instanceof RegExp
// 			|| abilData.abil_name.startsWith("item_")
// 			|| MyEnt.GetAbilityByName(abilData.abil_name) !== undefined,
// 	)
// }

// EventsSDK.on("Tick", () => {
// 	if (!MenuState.value) {
// 		return false
// 	}
// 	all_units.filter(unit => {
// 		if (!unit.IsControllable && !unit.IsHero || unit.IsEnemy()) {
// 			return
// 		}
// 		let availableAbils = GetAvailableAbils().filter(abilData => {
// 			let abil = abilData.abil = unit.GetAbilityByName(abilData.abil_name) || unit.GetItemByName(abilData.abil_name)
// 			return abil !== undefined && !abil.IsHidden && abil.CanBeCasted()
// 		})
		
// 		console.log(availableAbils.map(x => x.abil.Name))
// 	})
// 	// all_units.filter(unit => {
// 	// 	proj_list.filter(x => {
// 	// 		if (unit.IsEnemy()) {
// 	// 			return
// 	// 		}
// 	// 		if (unit.Distance2D(x.Position) <= 150) {
// 	// 			let abil = unit.GetAbilityByName("antimage_counterspell")
// 	// 			if (abil !== undefined && abil.CanBeCasted()) {
// 	// 				abil.UseAbility(unit)
// 	// 			}
// 	// 		}
// 	// 	})
// 	// })
// })

// EventsSDK.on("EntityCreated", x => {
// 	if (x instanceof Unit) {
// 		all_units.push(x)
// 	}
// })

// EventsSDK.on("TrackingProjectileCreated", (proj: TrackingProjectile) => {
// 	if (proj instanceof TrackingProjectile && proj.IsValid && proj.IsDodgeable) {
// 		proj_list.push(proj)
// 	}
// })
// EventsSDK.on("TrackingProjectileDestroyed", (proj: TrackingProjectile) => {
// 	if (proj instanceof TrackingProjectile && proj.IsValid && proj.IsDodgeable) {
// 		ArrayExtensions.arrayRemove(proj_list, proj)
// 	}
// })