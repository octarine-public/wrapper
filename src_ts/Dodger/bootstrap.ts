import { EventsSDK, Hero, TrackingProjectile, ArrayExtensions, Ability, Unit } from "wrapper/Imports"
import { MenuState } from "./Menu"


let SpawnEntity = false
let lengthItems: number = 0

export let all_units: Hero[] = []
export let proj_list: TrackingProjectile[] = []
const ignorelistitems = [
	"item_tango",
	"item_single",
	"item_courier",
	"item_tpscroll",
	"item_ward_observer",
	"item_bottle",
	"item_ward_sentry",
	"item_travel_boots",
	"item_travel_boots_2",
	"item_flask"
]
import InitMenu from "./Menu/Menu"

MenuState.OnValue(caller => {
	// if (!caller.value) {
	// 	GameEndedCallback()
	// }
	// console.log(caller.value)
})

export const initItemsTargetMap = new Map<Unit, InitMenu>()

function IsValidItems(item: Ability) {
	return item === undefined || item.IsHidden || !item.IsValid
		|| item.IsPassive || ignorelistitems.some(x => item.Name.includes(x))
}

function IsValidAbility(abil: Ability) {
	return abil === undefined || abil.IsHidden || !abil.IsValid || abil.IsPassive
}

function AddMenuHeroItemAbility(x: Hero) {
	let MenuDodger = initItemsTargetMap.get(x)
	if (MenuDodger === undefined) {
		return
	}
	if (lengthItems !== x.Inventory.GetItems(0, 5).length) {
		SpawnEntity = false
	}
	if (SpawnEntity || !x.IsControllable) {
		return
	}
	let NameHero = x.Name.toString().split("_").splice(3, 3).join(" ")
	x.Inventory.GetItems(0, 5).filter(item => {
		if (IsValidItems(item)) {
			return
		}
		MenuDodger.AddTreeInHero(x, NameHero, item)
		lengthItems = x.Inventory.GetItems(0, 5).length
		x.AbilitiesBook.Spells.filter(abil => {
			if (IsValidAbility(abil)) {
				return
			}
			MenuDodger.AddTreeInHero(x, NameHero, abil)
			SpawnEntity = true
		})
	})
}

EventsSDK.on("Tick", () => {
	if (!MenuState.value) {
		return
	}
	all_units.filter(AddMenuHeroItemAbility)
})

EventsSDK.on("EntityCreated", x => {
	if (x instanceof Hero) {
		all_units.push(x)
		SpawnEntity = false
	}
})
EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Hero) {
		ArrayExtensions.arrayRemove(all_units, x)
		SpawnEntity = false
	}
})
export function GameEndedCallback() {
	all_units = []
	proj_list = []
	lengthItems = 0
	SpawnEntity = false
}

EventsSDK.on("TrackingProjectileCreated", (proj: TrackingProjectile) => {
	if (proj instanceof TrackingProjectile && proj.IsValid) {
		proj_list.push(proj)
	}
})
EventsSDK.on("TrackingProjectileDestroyed", (proj: TrackingProjectile) => {
	if (proj instanceof TrackingProjectile && proj.IsValid) {
		ArrayExtensions.arrayRemove(proj_list, proj)
	}
})
function ClassCache() {
	if (!MenuState.value) {
		return
	}
	all_units.filter(unit => {
		let initMenuTarget = initItemsTargetMap.get(unit)
		if (initMenuTarget === undefined) {
			initMenuTarget = new InitMenu(unit)
			initItemsTargetMap.set(unit, initMenuTarget)
		}
	})
}

EventsSDK.on("Update", ClassCache)
EventsSDK.on("GameEnded", GameEndedCallback)