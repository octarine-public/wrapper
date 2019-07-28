import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color,EntityManager,Hero,Modifier,ArrayExtensions,Utils } from "wrapper/Imports";
let { MenuFactory } = MenuManager
const menu = MenuFactory("SkyWrathCombo"),
    active = menu.AddToggle("Active")

let sky: Hero = undefined,
    nearest: Hero = undefined,
    target: Hero = undefined,
    heroes: Hero[] = []

EventsSDK.on("GameStarted",hero=>{
    if(hero.Name === 'npc_dota_hero_skywrath_mage')
        sky = hero
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})
EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
EventsSDK.on("GameEnded",()=>{
    sky = undefined
    heroes = undefined
})
EventsSDK.on("Tick",()=>{
    if(!active.value || !Game.IsInGame || Game.IsPaused || sky === undefined || !sky.IsAlive)
        return
})
EventsSDK.on("Update",(cmd)=>{
    if(!active.value || !Game.IsInGame || Game.IsPaused || sky === undefined || !sky.IsAlive)
        return
    nearest = ArrayExtensions.orderBy(heroes, ent => ent.Distance(Utils.CursorWorldVec))[0]
})