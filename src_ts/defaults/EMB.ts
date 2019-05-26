import { MenuManager, RendererSDK, EventsSDK, Hero, Utils, Game, Vector3 } from "../CrutchesSDK/Imports";

var manabars: Hero[] = [],
	heroes: Hero[] = []

const EMBMenu = MenuManager.MenuFactory("EnemyManaBars"),
	stateMain = EMBMenu.AddToggle("State")//.OnValue(OnChangeValue);

EventsSDK.on("onEntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
		//&& npc.m_hReplicatingOtherHeroModel === undefined
	)
		heroes.push(npc)
})
Events.on("onEntityDestroyed", ent => {
	if (ent instanceof Hero)
		Utils.arrayRemove(heroes, ent)
})

Events.on("onUpdate", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	manabars = heroes.filter(npc => npc.IsAlive && npc.IsVisible)
})
Events.on("onDraw", () => {
	if (!stateMain.value || !IsInGame())
		return
	var off_x = 0, off_y, manabar_w, manabar_h
	
	{ // TODO: multiple aspect ratio support (current: 16:10)
		var screen_size = RendererSDK.WindowSize
		off_x = screen_size.x * -0.03095
		off_y = screen_size.y * -0.01715
		manabar_w = screen_size.x * 0.0583
		manabar_h = screen_size.y * 0.0067
	}
	
	manabars.forEach(hero => {
		
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))

		if (!wts.IsValid)
			return
			
		Renderer.FilledRect(wts.x + off_x, wts.y + off_y, manabar_w, manabar_h, 0, 0, 0) // black background
		Renderer.FilledRect(wts.x + off_x, wts.y + off_y, manabar_w * (hero.Mana / hero.MaxMana), manabar_h, 0, 0, 0xFF)
	})
})