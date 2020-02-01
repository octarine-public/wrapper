import { Color, EventsSDK, Hero, Game, LocalPlayer, Menu, RendererSDK, Vector2, DOTAGameUIState_t, EntityManager, Utils, Parse } from "wrapper/Imports"

const EMBMenu = Menu.AddEntry(["Visual", "Enemy Bars"])
const stateMain = EMBMenu.AddToggle("State", true)
const round_mode = EMBMenu.AddSwitcher("Rounding Mode", ["round", "floor"], 1)

const emb = EMBMenu.AddNode("Mana Bars")
const embText = emb.AddToggle("Show numbers", false)
const embSize = emb.AddSlider("Size", 14, 10, 30)
const number_mode_emb = emb.AddSwitcher("numbers Mode", ["Only HP", "HP/MaxHP", "Only Percent", "HP/Percent", "HP/MaxHP/Percent"], 1)

const ehb = EMBMenu.AddNode("HP Bars")
const ehbText = ehb.AddToggle("Show numbers", false)
const ehbSize = ehb.AddSlider("Size", 14, 10, 30)
const number_mode_ehb = ehb.AddSwitcher("numbers Mode", ["Only mana", "Mana/MaxMana", "Only Percent", "Mana/Percent", "Mana/MaxMana/Percent"], 1)


let br = " "
let config = (Utils.parseKVFile("resource/ui/unithealthbar_hero.res").get("Resource/UI/UnitHealthBar_Hero.res") as Parse.RecursiveMap).get("UnitManaBar") as Parse.RecursiveMap

function ShowNumber(selector: Menu.Switcher, num: number, max_num: number) {
	switch (selector.selected_id) {
		case 0:
			return `${Math.floor(num)}`
		case 1:
			return `${Math.floor(num)}/${Math.floor(max_num)}`
		case 2:
			return `${Math.floor(Math.floor(num) / Math.floor(max_num) * 100)}%`
		case 3:
			return `${Math.floor(num)}${br.repeat(3)} | ${br.repeat(3)}${Math.floor(Math.floor(num) / Math.floor(max_num) * 100)}%`
		case 4:
			return `${Math.floor(num)}/${Math.floor(max_num)}${br.repeat(2)} | ${br.repeat(2)}${Math.floor(Math.floor(num) / Math.floor(max_num) * 100)}%`
	}
	return ""
}

EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined || !stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return false
	let screen_size = RendererSDK.WindowSize
	if (screen_size.x === 1280 && screen_size.y === 1024)
		screen_size.y = 960
	let manabar_size = RendererSDK.GetProportionalScaledVector(new Vector2(parseInt(config.get("xpos") as string) * 2.25, parseInt(config.get("ypos") as string)), false).SubtractScalarX(1)

	EntityManager.GetEntitiesByClass(Hero).forEach(hero => {
		if (!hero.IsEnemy() || hero.IsIllusion || !hero.IsAlive || !hero.IsVisible || hero.IsInvulnerable)
			return
		let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
		if (wts === undefined)
			return
		wts.SubtractForThis(manabar_size.Divide(new Vector2(1.95, 0.42)))
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
			let text = ShowNumber(number_mode_emb, hero.Mana, hero.MaxMana),
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
			let text = ShowNumber(number_mode_ehb, hero.HP, hero.MaxHP),
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
