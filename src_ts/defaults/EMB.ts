import { MenuManager, RendererSDK, EventsSDK, Hero, ArrayExtensions, Game, Vector2, Color } from "wrapper/Imports";

var manabars: Hero[] = [],
	heroes: Hero[] = []

const EMBMenu = MenuManager.MenuFactory("Enemy Bars"),
	emb = EMBMenu.AddTree("Mana Bars"),
	ehb = EMBMenu.AddTree("Hp Bars"),
	stateMain = emb.AddToggle("State",true),
	embText = emb.AddCheckBox("Show numbers",false),
	ehbText = ehb.AddCheckBox("Show numbers ### 2",false),
	floor = Math.floor;

EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

EventsSDK.on("Update", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	manabars = heroes.filter(npc => npc.IsAlive && npc.IsVisible)
});
EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return;
		
	let off_x: number, 
		off_y: number,
		//off_x_text: number,
		//off_y_text: number,
		manabar_w: number,
		manabar_h: number;
	
	{ // TODO: multiple aspect ratio support (current: 16:10)
		let screen_size = RendererSDK.WindowSize
		if (screen_size.x === 1920 && screen_size.y === 1080){
			off_x = screen_size.x * -0.027;
			off_y = screen_size.y * -0.01715;
			manabar_w = screen_size.x * 0.053;
			manabar_h = screen_size.y * 0.005;
			//off_x_text = screen_size.x * 0.017;
			//off_y_text = screen_size.y * -0.003;
			
		} else if (screen_size.x === 1680 && screen_size.y === 1050) {
			off_x = screen_size.x * -0.03095
			off_y = screen_size.y * -0.01715
			manabar_w = screen_size.x * 0.0583
			manabar_h = screen_size.y * 0.0067
		} else {
			off_x = screen_size.x * -0.038;
			off_y = screen_size.y * -0.01715;
			manabar_w = screen_size.x * 0.075;
			manabar_h = screen_size.y * 0.0067;
		}
	}
	
	manabars.forEach(hero => {
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined)
			return;
		wts.AddScalarX(off_x).AddScalarY(off_y);
		let size = new Vector2(manabar_w, manabar_h);
		RendererSDK.FilledRect(wts, size, Color.Black);
		size.MultiplyScalarForThis(hero.Mana / hero.MaxMana)
		size.SetY(manabar_h)
		RendererSDK.FilledRect(wts, size, Color.RoyalBlue);
		wts.AddScalarX(25).AddScalarY(-4)
		if(embText.value){
			RendererSDK.Text(`${floor(hero.Mana)}/${floor(hero.MaxMana)}`,wts,Color.White,'Calibri',new Vector2(14,200))
		}
		if(ehbText.value){
			RendererSDK.Text(`${floor(hero.HP)}/${floor(hero.MaxHP)}`,wts.AddScalarY(-10),Color.White,'Calibri',new Vector2(14,200))
		}
		//let mana: any = Math.round(hero.Mana);
		//wts.AddScalarX(off_x_text).AddScalarY(off_y_text);
		//RendererSDK.Text(mana + "/" + Math.round(hero.MaxMana), wts, Color.White, "Calibri", new Vector2(14, 100))
	});
});