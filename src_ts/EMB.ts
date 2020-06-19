import { Color, EventsSDK, GameRules, Hero, LocalPlayer, Menu, RendererSDK, Vector2, DOTAGameUIState_t, EntityManager, GameState } from "wrapper/Imports"

const EMBMenu = Menu.AddEntry(["Visual", "Enemy Bars"])
const stateMain = EMBMenu.AddToggle("State", true)

const emb = EMBMenu.AddNode("Mana Bars")
const embText = emb.AddToggle("Show numbers", false)
const embSize = emb.AddSlider("Size", 14, 10, 30)
const number_mode_emb = emb.AddSwitcher("numbers Mode", ["Only HP", "HP/MaxHP", "Only Percent", "HP/Percent", "HP/MaxHP/Percent"], 1)

const ehb = EMBMenu.AddNode("HP Bars")
const ehbText = ehb.AddToggle("Show numbers", false)
const ehbSize = ehb.AddSlider("Size", 14, 10, 30)
const number_mode_ehb = ehb.AddSwitcher("numbers Mode", ["Only mana", "Mana/MaxMana", "Only Percent", "Mana/Percent", "Mana/MaxMana/Percent"], 1)

let br = " "

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
	if (LocalPlayer === undefined || !stateMain.value || !GameRules?.IsInGame || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(hero => {
		if (!hero.IsEnemy() || hero.IsIllusion || !hero.IsAlive || !hero.IsVisible || hero.IsInvulnerable)
			return
		let manabar_ar = hero.ManaBarOnScreen
		if (manabar_ar === undefined)
			return
		let [manabar_pos, manabar_size] = manabar_ar
		RendererSDK.FilledRect(manabar_pos, manabar_size, Color.Black)
		RendererSDK.FilledRect(manabar_pos, new Vector2(manabar_size.x * hero.Mana / hero.MaxMana, manabar_size.y), Color.RoyalBlue)
		if (embText.value) {
			let text = ShowNumber(number_mode_emb, hero.Mana, hero.MaxMana)
			RendererSDK.Text(
				text,
				manabar_pos
					.Clone()
					.AddScalarX((manabar_size.x - RendererSDK.GetTextSize(text, "Calibri", embSize.value).x) / 2)
					.AddScalarY(manabar_size.y + 6)
					.SubtractScalarY((manabar_size.y)),
				Color.White,
				"Calibri",
				embSize.value
			)
		}
		if (ehbText.value) {
			let [healthbar_pos, healthbar_size] = manabar_ar
			let text = ShowNumber(number_mode_ehb, hero.HP, hero.MaxHP)
			RendererSDK.Text(
				text,
				healthbar_pos
					.Clone()
					.AddScalarX((healthbar_size.x - RendererSDK.GetTextSize(text, "Calibri", ehbSize.value).x) / 2)
					.AddScalarY(healthbar_size.y + 2)
					.SubtractScalarY(healthbar_size.y * 1.75),
				Color.White,
				"Calibri",
				ehbSize.value
			)
		}
	})
})
