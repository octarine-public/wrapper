import {
	ArrayExtensions,
	Color,
	EventsSDK,
	Game,
	Hero,
	MenuManager,
	RendererSDK,
	Vector2,
} from "wrapper/Imports"

let renderable_heroes: Hero[] = [],
	heroes: Hero[] = []

const Menu = MenuManager.MenuFactory("Cooldown Display"),
	stateMain = Menu.AddToggle("State"),
	size = Menu.AddSlider("Size", 30, 3, 100),
	opacity = Menu.AddSlider("Opacity", 255, 0, 255),
	lvl_r = Menu.AddSlider("Level R", 255, 0, 255),
	lvl_g = Menu.AddSlider("Level G", 255, 0, 255),
	lvl_b = Menu.AddSlider("Level B", 255, 0, 255),
	panelx = Menu.AddSlider("X offset", 0, 0, 100),
	panely = Menu.AddSlider("Y offset", 0, 0, 100)

EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
Events.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

Events.on("Update", () => {
	if (!stateMain.value)
		return
	renderable_heroes = heroes.filter(npc => npc.IsAlive && npc.IsVisible && !npc.IsIllusion)
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
EventsSDK.on("Draw", () => {
	if (!stateMain.value)
		return
	renderable_heroes.forEach(hero => {
		// loop-optimizer: FORWARD
		let renderable_abils = hero.Spells.filter((abil, i) => {
			let name = abil.Name
			return i < 6 && !ignore_abils.some(ignore_name => name === ignore_name) && !abil.IsHidden
		})
		// loop-optimizer: FORWARD
		renderable_abils.forEach(((abil, i) => {
			let screen_pos = RendererSDK.WorldToScreen(hero.Position)

			if (screen_pos !== undefined) {
				let need_pos = (screen_pos.AddScalarX(size.value * i)).Add(new Vector2(panelx.value, 30 + panely.value)).Subtract(new Vector2(renderable_abils.length * (size.value / 2), 0))
				RendererSDK.Image("panorama/images/spellicons/" + abil.Name + "_png.vtex_c", need_pos, new Vector2(size.value, size.value), new Color(255, 255, 255, opacity.value))
				if (abil.IsInAbilityPhase) {
					let time = Math.max(((Game.RawGameTime - abil.CastStartTime) / abil.CastPoint), 0)
					RendererSDK.FilledRect (
						need_pos.Clone().AddScalarY(size.value * time),
						new Vector2(size.value, size.value * (1 - time)),
						new Color(232, 232, 232, 100),
					)
				}
				if (abil.Level !== 0) {
					let r = 0, g = 255, b = 0, a = 40
					if (hero.Mana < abil.ManaCost) {
						r = 0, g = 170, b = 255
					}
					if (a)
						RendererSDK.OutlinedRect(need_pos, new Vector2(size.value, size.value), new Color(r, g, b, opacity.value > 40 ? opacity.value - a : 10))
					else
						RendererSDK.OutlinedRect(need_pos, new Vector2(size.value, size.value), new Color(r, g, b, opacity.value))
				} else
					RendererSDK.OutlinedRect(need_pos, new Vector2(size.value, size.value), new Color(255, 0, 0, opacity.value))
				if (abil.Cooldown !== 0) {
					let s = size.value / 3.5
					let cd = abil.Cooldown
					if (cd >= 10) {
						if (cd < 100)
							s = size.value / 5
						else
							s = size.value / 10
					}
					RendererSDK.FilledRect(need_pos, new Vector2(size.value, size.value), new Color(0, 0, 0, 150))
					RendererSDK.Text(
						cd.toFixed(1),
						need_pos.Clone().AddScalarX(s).AddScalarY(size.value / 2.9),
						new Color(255, 255, 255),
						"Consolas",
						new Vector2(size.value / 3, 0),
						FontFlags_t.OUTLINE,
					)
				}
				for (let i = 0, lvl = abil.Level, end = abil.MaxLevel; i < end; i++) {
					let rect_pos = need_pos.Clone().AddScalarX(size.value / end * i).AddScalarY(size.value * (17 / 20)),
						rect_size = new Vector2(size.value / end, size.value * (3 / 20))
					if (lvl > i)
						RendererSDK.FilledRect(rect_pos, rect_size, new Color(185, 167, 110))
					RendererSDK.OutlinedRect(rect_pos, rect_size, new Color(185, 167, 110))
				}
			}
		}))
	})
})