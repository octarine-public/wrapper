import { ArrayExtensions, Color, EventsSDK, Game, Hero, Menu, RendererSDK, Vector2, EntityManager } from "wrapper/Imports"

var manabars: Hero[] = [],
	heroes: Hero[] = []

function IsSpectator(): boolean {
	let LocalPlayer = EntityManager.LocalPlayer
	if (LocalPlayer !== undefined && LocalPlayer.Team === 1)
		return true
	return false
}
const EMBMenu = Menu.AddEntry(["Visual", "Enemy Bars"]),
	emb = EMBMenu.AddNode("Mana Bars"),
	ehb = EMBMenu.AddNode("Hp Bars"),
	stateMain = emb.AddToggle("State", true),
	embText = emb.AddToggle("Show numbers", false),
	embSize = emb.AddSlider("Size",14,10,30),
	ehbText = ehb.AddToggle("Show numbers", false),
	ehbSize = ehb.AddSlider("Size",14,10,30),
	floor = Math.floor

EventsSDK.on("EntityCreated", npc => {
	if (IsSpectator())
		return false
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (IsSpectator())
		return false
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

EventsSDK.on("Update", () => {
	if (IsSpectator())
		return false
	if (!stateMain.value || Game.IsPaused)
		return
	manabars = heroes.filter(npc => npc.IsAlive && npc.IsVisible)
})

EventsSDK.on("Draw", () => {
	if (IsSpectator())
		return false
	if (!stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return

	let off_x: number,
		off_y: number,
		// off_x_text: number,
		// off_y_text: number,
		manabar_w: number,
		manabar_h: number,
		screen_size = RendererSDK.WindowSize,
		ratio = RendererSDK.GetAspectRatio()

	{ // TODO: multiple aspect ratio support (current: 16:10)
		if (ratio==='16x9') {
			off_x = screen_size.x * -0.027
			off_y = screen_size.y * -0.01715
			manabar_w = screen_size.x * 0.053
			manabar_h = screen_size.y * 0.005
			// off_x_text = screen_size.x * 0.017;
			// off_y_text = screen_size.y * -0.003;

		} else if (ratio==='16x10') {
			off_x = screen_size.x * -0.03095
			off_y = screen_size.y * -0.01715
			manabar_w = screen_size.x * 0.0583
			manabar_h = screen_size.y * 0.0067
		}else if(ratio==='21x9'){
			off_x = screen_size.x * -0.020
			off_y = screen_size.y * -0.01715
			manabar_w = screen_size.x * 0.039
			manabar_h = screen_size.y * 0.007
		} else {
			off_x = screen_size.x * -0.038
			off_y = screen_size.y * -0.01715
			manabar_w = screen_size.x * 0.075
			manabar_h = screen_size.y * 0.0067
		}
	}

	manabars.forEach(hero => {
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined)
			return
		wts.AddScalarX(off_x).AddScalarY(off_y)
		let size = new Vector2(manabar_w, manabar_h)
		RendererSDK.FilledRect(wts, size, Color.Black)
		size.MultiplyScalarForThis(hero.Mana / hero.MaxMana)
		size.SetY(manabar_h)
		RendererSDK.FilledRect(wts, size, Color.RoyalBlue)
		let addx = 25,addy = -4,addyehb = -10+(-embSize.value/4)
		if(ratio === '21x9'){
			addx = 46
		}
		wts.AddScalarX(addx).AddScalarY(addy)
		if (embText.value) {
			RendererSDK.Text(`${floor(hero.Mana)}/${floor(hero.MaxMana)}`, wts, Color.White, "Calibri", new Vector2(embSize.value, 200))
		}
		if (ehbText.value) {
			RendererSDK.Text(`${floor(hero.HP)}/${floor(hero.MaxHP)}`, wts.AddScalarY(addyehb), Color.White, "Calibri", new Vector2(ehbSize.value, 200))
		}
		// let mana: any = Math.round(hero.Mana);
		// wts.AddScalarX(off_x_text).AddScalarY(off_y_text);
		// RendererSDK.Text(mana + "/" + Math.round(hero.MaxMana), wts, Color.White, "Calibri", new Vector2(14, 100))
	})
})
