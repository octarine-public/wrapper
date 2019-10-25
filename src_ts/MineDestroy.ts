import { ArrayExtensions, EventsSDK, Game, LocalPlayer, Menu, Unit } from "./wrapper/Imports"

const menu = Menu.AddEntry(["Utility", "Mine Destroyer"])
const menuState = menu.AddToggle("State", true)

let mines: Unit[] = [] // C_DOTA_NPC_TechiesMines

EventsSDK.on("EntityCreated", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines && ent.Name === "npc_dota_techies_land_mine")
		mines.push(ent as Unit)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		ArrayExtensions.arrayRemove(mines, ent)
})

EventsSDK.on("Tick", () => {
	if (!menuState.value)
		return

	let hero = LocalPlayer.Hero

	if (hero === undefined || !hero.IsAlive || hero.IsChanneling || hero.IsInFadeTime)
		return

	let mine = mines.find(mine => mine.IsEnemy() && mine.IsAlive && hero.CanAttack(mine) && mine.IsInRange(hero, hero.AttackRange))
	if (mine !== undefined)
		hero.AttackTarget(mine)
})
