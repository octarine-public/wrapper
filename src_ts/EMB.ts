import { Color, EventsSDK, Game, Hero, LocalPlayer, Menu, RendererSDK, Vector2, DOTAGameUIState_t, EntityManager, Utils, Parse } from "wrapper/Imports"

const EMBMenu = Menu.AddEntry(["Visual", "Enemy Bars"]),
	emb = EMBMenu.AddNode("Mana Bars"),
	ehb = EMBMenu.AddNode("Hp Bars"),
	stateMain = emb.AddToggle("State", true),
	embText = emb.AddToggle("Show numbers", false),
	embSize = emb.AddSlider("Size", 14, 10, 30),
	ehbText = ehb.AddToggle("Show numbers", false),
	ehbSize = ehb.AddSlider("Size", 14, 10, 30)

let config = (Utils.parseKVFile("resource/ui/unithealthbar_hero.res").get("Resource/UI/UnitHealthBar_Hero.res") as Parse.RecursiveMap).get("UnitManaBar") as Parse.RecursiveMap
EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined || !stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return false
	let screen_size = RendererSDK.WindowSize
	if (screen_size.x == 1280 && screen_size.y == 1024)
		screen_size.y = 960
	let manabar_w = Math.floor(screen_size.x / 0x400 * parseInt(config.get("xpos") as string)) * 2,
		manabar_h = Math.floor(screen_size.y / 0x400 * parseInt(config.get("ypos") as string))

	EntityManager.GetEntitiesByClass(Hero).forEach(hero => {
		if (!hero.IsEnemy() || hero.IsIllusion || !hero.IsAlive || !hero.IsVisible)
			return
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined)
			return
		wts.x -= manabar_w / 2
		wts.y -= manabar_h * 3
		RendererSDK.FilledRect(wts, new Vector2(manabar_w, manabar_h), Color.Black)
		RendererSDK.FilledRect(wts, new Vector2(manabar_w * hero.Mana / hero.MaxMana, manabar_h), Color.RoyalBlue)
		if (embText.value)
			RendererSDK.Text(`${Math.floor(hero.Mana)}/${Math.floor(hero.MaxMana)}`, wts, Color.White, "Calibri", new Vector2(embSize.value, 200))
		if (ehbText.value)
			RendererSDK.Text(`${Math.floor(hero.HP)}/${Math.floor(hero.MaxHP)}`, wts, Color.White, "Calibri", new Vector2(ehbSize.value, 200))
		// let mana: any = Math.round(hero.Mana);
		// wts.AddScalarX(off_x_text).AddScalarY(off_y_text);
		// RendererSDK.Text(mana + "/" + Math.round(hero.MaxMana), wts, Color.White, "Calibri", new Vector2(14, 100))
	})
})
