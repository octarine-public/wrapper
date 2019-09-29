import {EventsSDK, Game, Hero, LocalPlayer, Menu, Modifier } from "wrapper/Imports"

const menu = Menu.AddEntry(["Utility", "Abyssal Abuser"]),
	active = menu.AddToggle("Active")

let lock = false,
	recipeC = false,
	bashC = false,
	vanguardC = false,
	checkAbys = false,
	arModifiers: Map<Modifier, number> = new Map(),
	myHero: Hero
EventsSDK.on("BuffAdded", (npc, buff) => {
	if (active.value && buff.Name === "modifier_bashed" && buff.Ability !== undefined && buff.Ability.Owner === myHero) {
		arModifiers.set(buff, buff.DieTime)
		checkAbyss()
	}
})
function checkAbyss() {
	const abys = myHero.GetItemByName("item_abyssal_blade")
	if (!lock && abys !== undefined && myHero.Inventory.HasFreeSlots(0, 8, 2)) {
		myHero.DisassembleItem(abys, false)
		lock = true
		recipeC = true
		bashC = true
		vanguardC = true
		checkAbys = false
	}else if (abys === undefined) {
		if (recipeC || bashC || vanguardC)
			checkAbys = false
		else
			checkAbys = true
	}
}
EventsSDK.on("Tick", () => {
	if (!active.value || !Game.IsInGame || Game.IsPaused || LocalPlayer.Hero === undefined || !LocalPlayer.Hero.IsAlive)
		return false
	// loop-optimizer: KEEP
	arModifiers.forEach((time, buff) => {
		if (!time || !buff.DieTime)
			arModifiers.delete(buff)
		else if (buff.DieTime !== time) {
			arModifiers.set(buff, buff.DieTime)
			checkAbyss()
		}
	})
	if (!lock && !checkAbys)
		return false
	if (checkAbys) {
		checkAbyss()
		return false
	}
	if (lock) {
		if (recipeC) {
			const recipe = myHero.GetItemByName("item_recipe_abyssal_blade", true)
			if (recipe !== undefined) {
				myHero.ItemSetCombineLock(recipe, false)
				recipeC = false
			}
		}
		if (bashC) {
			const bash = myHero.GetItemByName("item_basher", true)
			if (bash !== undefined) {
				myHero.ItemSetCombineLock(bash, false)
				bashC = false
			}
		}
		if (vanguardC) {
			const vanguard = myHero.GetItemByName("item_vanguard", true)
			if (vanguard !== undefined) {
				myHero.ItemSetCombineLock(vanguard, false)
				vanguardC = false
			}
		}
		if (!recipeC && !bashC && !vanguardC) {
			lock = false
		}
	}
	return false
})
EventsSDK.on("GameStarted", hero => myHero = hero)
EventsSDK.on("GameEnded", () => {
	myHero = undefined
	lock = false
	recipeC = false
	bashC = false
	vanguardC = false
	checkAbys = false
	arModifiers = new Map()
})
