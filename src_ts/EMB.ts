import { Color, EventsSDK, Game, Hero, LocalPlayer, Menu, RendererSDK, Vector2, DOTAGameUIState_t, EntityManager, Utils, Parse } from "wrapper/Imports"

const EMBMenu = Menu.AddEntry(["Visual", "Enemy Bars"]),
	emb = EMBMenu.AddNode("Mana Bars"),
	ehb = EMBMenu.AddNode("HP Bars"),
	stateMain = EMBMenu.AddToggle("State", true),
	round_mode = EMBMenu.AddSwitcher("Rounding Mode", ["round", "floor"], 1),
	embText = emb.AddToggle("Show numbers", false),
	embSize = emb.AddSlider("Size", 14, 10, 30),
	ehbText = ehb.AddToggle("Show numbers", false),
	ehbSize = ehb.AddSlider("Size", 14, 10, 30)

let config = (Utils.parseKVFile("resource/ui/unithealthbar_hero.res").get("Resource/UI/UnitHealthBar_Hero.res") as Parse.RecursiveMap).get("UnitManaBar") as Parse.RecursiveMap
EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined || !stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return false
	let screen_size = RendererSDK.WindowSize
	if (screen_size.x === 1280 && screen_size.y === 1024)
		screen_size.y = 960
	let manabar_size = Utils.GetProportionalScaledVector(new Vector2(parseInt(config.get("xpos") as string) * 2.25, parseInt(config.get("ypos") as string)), false).SubtractScalarX(1)

	EntityManager.GetEntitiesByClass(Hero).forEach(hero => {
		if (!hero.IsEnemy() || hero.IsIllusion || !hero.IsAlive || !hero.IsVisible)
			return
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined)
			return
		wts.SubtractForThis(manabar_size.Divide(new Vector2(1.9, 0.4)))
		if (round_mode.selected_id === 1) {
			wts.x = Math.floor(wts.x)
			wts.y = Math.floor(wts.y)
		} else {
			wts.x = Math.round(wts.x)
			wts.y = Math.round(wts.y)
		}
		RendererSDK.FilledRect(wts, manabar_size, Color.Black)
		RendererSDK.FilledRect(wts, new Vector2(manabar_size.x * hero.Mana / hero.MaxMana, manabar_size.y), Color.RoyalBlue)
		if (embText.value) {
			let text = `${Math.floor(hero.Mana)}/${Math.floor(hero.MaxMana)}`,
				size = new Vector2(embSize.value, 200)
			RendererSDK.Text(
				text,
				wts
					.Clone()
					.AddScalarX((manabar_size.x - RendererSDK.GetTextSize(text, "Calibri", size).x) / 2)
					.SubtractScalarY(manabar_size.y / 2),
				Color.White,
				"Calibri",
				size
			)
		}
		if (ehbText.value) {
			let text = `${Math.floor(hero.HP)}/${Math.floor(hero.MaxHP)}`,
				size = new Vector2(ehbSize.value, 200)
			RendererSDK.Text(
				text,
				wts
					.Clone()
					.AddScalarX((manabar_size.x - RendererSDK.GetTextSize(text, "Calibri", size).x) / 2)
					.SubtractScalarY(manabar_size.y * 1.75),
				Color.White,
				"Calibri",
				size
			)
		}
		// let mana: any = Math.round(hero.Mana);
		// wts.AddScalarX(off_x_text).AddScalarY(off_y_text);
		// RendererSDK.Text(mana + "/" + Math.round(hero.MaxMana), wts, Color.White, "Calibri", new Vector2(14, 100))
	})
})
