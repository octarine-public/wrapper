import { ArrayExtensions, EventsSDK, LocalPlayer, Menu, Unit, MovingObstacle, Obstacle, npc_dota_hero_pudge, pudge_meat_hook, Prediction } from "./wrapper/Imports"

const menu = Menu.AddEntry(["Utility", "Mine Destroyer"])
const menuState = menu.AddToggle("State", true)

let mines: Unit[] = [] // C_DOTA_NPC_TechiesMines

EventsSDK.on("EntityCreated", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		mines.push(ent as Unit)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		ArrayExtensions.arrayRemove(mines, ent)
})

EventsSDK.on("Tick", () => {
	if (!menuState.value)
		return
	let pudge = EntityManager.GetEntitiesByClass(npc_dota_hero_pudge)[0]
	if (pudge !== undefined) {
		let meat_hook = pudge.GetAbilityByClass(pudge_meat_hook)
		if (meat_hook !== undefined)
			console.log(new Prediction(pudge).GetFirstHitTarget(meat_hook.CastRange, meat_hook.AOERadius, meat_hook.Speed)?.Name)
	}

	EntityManager.GetEntitiesInRange(new Vector3(), 120 * 2).map(ent => ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent))
	let hero = LocalPlayer!.Hero

	if (hero === undefined || !hero.IsAlive || hero.IsChanneling || hero.IsInFadeTime)
		return

	let mine = mines.find(mine_ =>
		mine_.IsEnemy()
		&& mine_.IsAlive
		&& hero!.CanAttack(mine_)
		&& mine_.IsInRange(hero!, hero!.AttackRange)
		&& mine_.Name === "npc_dota_techies_land_mine"
	)
	if (mine !== undefined)
		hero.AttackTarget(mine)
})
