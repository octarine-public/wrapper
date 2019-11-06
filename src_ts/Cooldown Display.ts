import {
	Ability,
	ArrayExtensions,
	Color,
	EntityManager,
	EventsSDK,
	Game,
	Hero,
	LocalPlayer,
	Menu as MenuSDK,
	RendererSDK,
	Team,
	Vector2,
} from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Visual", "Cooldown Display"]),
	optionEnable = Menu.AddToggle("Enable"),
	optionAlly = Menu.AddToggle("Show ally"),
	optionSelf = Menu.AddToggle("Show local"),
	optionBoxSize = Menu.AddSlider("Size", 30, 20, 60),
	optionBoxPixelOffset = Menu.AddSlider("Pixel Offset", 0, -150, 150),
	optionBoxWorldOffset = Menu.AddSlider("World Offset", 0, -250, 250),
	optionBoxAlpha = Menu.AddSlider("Opacity", 255, 0, 255),
	optionFontBold = Menu.AddToggle("Font bold"),
	optionFontOutlined = Menu.AddToggle("Font outlined"),
	DrawRGBA = Menu.AddColorPicker("Color ability level", new Color(0, 255, 255))

	Menu.AddButton("Reset position").OnValue(() => {
		optionBoxPixelOffset.value = 0
		optionBoxWorldOffset.value = -50
	})

let ignore_abils = [
	"morphling_morph_agi",
	"morphling_morph_str",
	"invoker_empty1",
	"invoker_empty2",
	"generic_hidden",
	"rubick_hidden1",
	"rubick_hidden2",
	"rubick_hidden3",
]

let heroes: Hero[] = []
EventsSDK.on("EntityCreated", npc => {
	if (npc instanceof Hero && !npc.IsIllusion)
		heroes.push(npc)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

function IsCastable(ability: Ability, mana): boolean {
	return (
		ability.ManaCost <= mana &&
		ability.Level > 0 &&
		ability.Cooldown <= 0
	)
}

function DrawAbilityLevels(ability: Ability, x, y) {
	let level = ability.Level

	let level_box_size = Math.floor(optionBoxSize.value * 0.1875)

	x++
	y += optionBoxSize.value - level_box_size - 1

	for (let i = 0; i < level; i++) {
		let size = new Vector2(level_box_size, level_box_size)
		let pos = new Vector2(x + i * level_box_size, y)

		RendererSDK.FilledRect(
			pos,
			size,
			new Color(DrawRGBA.Color.r, DrawRGBA.Color.g, DrawRGBA.Color.b, DrawRGBA.Color.a),
		)

		RendererSDK.OutlinedRect(
			pos,
			size,
			new Color(0, 0, 0),
		)
	}
}

function DrawAbilitySquare(hero: Hero, ability: Ability, x, y, index) {
	let real_x = x + (index * optionBoxSize.value) + 2
	// default colors = can cast
	let imageColor = new Color(255, 255, 255)
	let outlineColor = new Color(0, 255, 0)

	if (!IsCastable(ability, hero.Mana)) {
		if (ability.Level === 0) {
			imageColor = new Color(125, 125, 125)
			outlineColor = new Color(255, 0, 0)
		} else if (ability.ManaCost > hero.Mana) {
			imageColor = new Color(150, 150, 255)
			outlineColor = new Color(0, 0, 255)
		} else {
			imageColor = new Color(255, 150, 150)
			outlineColor = new Color(255, 0, 0)
		}
	}

	imageColor.SetA(optionBoxAlpha.value)

	let box_size = new Vector2(optionBoxSize.value, optionBoxSize.value)

	RendererSDK.Image(
		"panorama/images/spellicons/" + ability.Name + "_png.vtex_c",
		new Vector2(real_x, y),
		box_size,
		imageColor,
	)

	RendererSDK.OutlinedRect(new Vector2(real_x, y), box_size, outlineColor)

	let cooldown_length = ability.CooldownLength
	let cooldown = ability.Cooldown

	if (cooldown > 0.0 && cooldown_length > 0.0) {

		let inner_box_size = optionBoxSize.value - 2

		let cooldown_ratio = cooldown / cooldown_length
		let cooldown_size = Math.floor(inner_box_size * cooldown_ratio)

		RendererSDK.FilledRect(
			new Vector2(real_x + 1, y + (inner_box_size - cooldown_size) + 1),
			new Vector2(inner_box_size, cooldown_size),
			new Color(255, 255, 255, 50),
		)

		let text_cooldown = (
			cooldown >= 10 ?
				Math.floor(cooldown) :
				cooldown.toFixed(1)
		).toString()

		const magic_number = 0.643

		let font_size = Math.floor(inner_box_size * magic_number)

		RendererSDK.Text(
			text_cooldown,
			new Vector2(
				real_x + inner_box_size / 2 -
				text_cooldown.length * font_size * (1 - magic_number) / 2,
				y,
			),
			new Color(255, 255, 255),
			"Tahoma",
			new Vector2(
				font_size,
				optionFontBold.value ? 800 : 200,
			),
			optionFontOutlined.value ? FontFlags_t.OUTLINE : 0,
		)
	}
	DrawAbilityLevels(ability, real_x, y)
}

function DrawDisplay(hero: Hero) {
	let pos = hero.Position.AddScalarZ(optionBoxWorldOffset.value)

	let screen_pos = RendererSDK.WorldToScreen(pos)

	if (screen_pos === undefined)
		return
	// loop-optimizer: FORWARD, POSSIBLE_UNDEFINED
	let abilities = hero.Spells.filter((abil, i) => {
		let name = abil.Name
		return i < 6 &&
			!ignore_abils.some(ignore_name => name === ignore_name) &&
			!abil.IsHidden
	})

	let start_x = screen_pos.x - Math.floor((abilities.length / 2) * optionBoxSize.value)
	let start_y = screen_pos.y + optionBoxPixelOffset.value

	RendererSDK.FilledRect(
		new Vector2(start_x + 1, start_y - 1),
		new Vector2((optionBoxSize.value * abilities.length) + 2, optionBoxSize.value + 2),
		new Color(0, 0, 0, 160),
	)

	abilities.forEach(((ability, i) => {
		DrawAbilitySquare(hero, ability, start_x, start_y, i)
	}))

	RendererSDK.OutlinedRect(
		new Vector2(start_x + 1, start_y - 1),
		new Vector2(
			(optionBoxSize.value * abilities.length) + 2,
			optionBoxSize.value + 2,
		),
		new Color(0, 0, 0),
	)
}

EventsSDK.on("Draw", () => {
	if(LocalPlayer === undefined) {
		return false
	}
	if (!optionEnable.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return
	heroes.forEach(hero => {
		if (hero.IsAlive && !hero.IsDormant) {
			let is_local = LocalPlayer !== undefined && hero === LocalPlayer.Hero

			if (
				(optionSelf.value || !is_local) &&
				(optionAlly.value || hero.IsEnemy() || is_local)
			) {
				DrawDisplay(hero)
			}
		}
	})
})

EventsSDK.on("GameEnded", () => {
	heroes = []
})
