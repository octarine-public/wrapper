import { MenuManager, RendererSDK, EventsSDK, Hero, ArrayExtensions, Game, Vector2, Color } from "../wrapper/Imports";

var manabars: Hero[] = [],
	heroes: Hero[] = []

const EMBMenu = MenuManager.MenuFactory("EnemyManaBars"),
	stateMain = EMBMenu.AddToggle("State");

EventsSDK.on("onEntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
Events.on("onEntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

Events.on("onUpdate", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	manabars = heroes.filter(npc => npc.IsAlive && npc.IsVisible)
})
Events.on("onDraw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return;
		
	let off_x: number, 
		off_y: number, 
		manabar_w: number, 
		manabar_h: number;
	
	{ // TODO: multiple aspect ratio support (current: 16:10)
		let screen_size = RendererSDK.WindowSize
		off_x = screen_size.x * -0.03095
		off_y = screen_size.y * -0.01715
		manabar_w = screen_size.x * 0.0583
		manabar_h = screen_size.y * 0.0067
	}
	
	manabars.forEach(hero => {
		
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))

		wts.AddScalarX(off_x).AddScalarY(off_y);
		
		if (!wts.IsValid)
			return
			
		let size = new Vector2(manabar_w, manabar_h);
			
		RendererSDK.FilledRect(wts, size, Color.Black);
		RendererSDK.FilledRect(wts, size.MultiplyScalarForThis((hero.Mana / hero.MaxMana)), Color.Blue);
	})
})