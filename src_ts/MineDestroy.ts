import { MenuManager, EventsSDK, Unit, ArrayExtensions, Game, LocalPlayer, Debug } from "./wrapper/Imports";

const menu = MenuManager.MenuFactory("Mine Destroy");
const menuState = menu.AddToggle("State");

let mines: Unit[] = []; // C_DOTA_NPC_TechiesMines

EventsSDK.on("onEntityCreated", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines && ent.IsEnemy() && ent.Name === "npc_dota_techies_land_mine")
		mines.push(ent as Unit);
})

EventsSDK.on("onEntityDestroyed", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		ArrayExtensions.arrayRemove(mines, ent);
})

EventsSDK.on("onTick", () => {
	if (!menuState.value || Game.IsPaused)
		return;
		
	let hero = LocalPlayer.Hero;
	
	if (hero === undefined || !hero.IsAlive || hero.IsChanneling || hero.IsInFadeTime)
		return;

	let mine = mines.find(mine => mine.IsAlive && hero.CanAttack(mine) 
		&& mine.IsInRange(hero, Math.max(hero.AttackRange, mine.ModifiersBook.GetBuff(0).Ability.AOERadius)));
	
	if (mine !== undefined)
		hero.AttackTarget(mine);
})