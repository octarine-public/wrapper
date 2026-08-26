import {
	Color,
	Entity,
	EntityManager,
	Events,
	EventsSDK,
	ExecuteOrder,
	GameState,
	Hero,
	InputEventSDK,
	Menu,
	MenuLanguageID,
	RendererSDK,
	Vector2
} from "../../../wrapper/Imports"
import { InternalAnimations } from "./Animations"
import { InternalCamera } from "./Camera"
import { InternalConfig } from "./Config"
import { InternalNotifications } from "./Notifications"

new (class CInternalSettings {
	private setLanguageCounter = 0
	private readonly tree = Menu.AddEntry("Settings")
	private readonly cCamera = new InternalCamera(this.tree)
	private readonly cNotifications = new InternalNotifications(this.tree)
	// no runtime hooks — just wires the animation toggles into Base.*Animation flags
	public readonly cAnimations = new InternalAnimations(this.tree)
	private readonly cConfig = new InternalConfig(this.tree)

	private readonly reloadTree = this.tree.AddNode(
		"Reload Scripts",
		"menu/icons/reload.svg"
	)

	private readonly menuKeyBind = this.tree.AddKeybind("Menu Bind", "Insert")
	private readonly key = this.reloadTree.AddKeybind("Key Bind")

	private readonly rendererStats = this.tree.AddToggle(
		"Renderer debug stats",
		false,
		"Draws renderer command-list sizes and\nrelative-anchor op counts (debug)"
	)

	private readonly spawnTestHeroes = this.tree.AddButton(
		"Spawn test heroes",
		"Creates 4 allied + 5 enemy heroes at the cursor,\nmax-levels them and gives each 6 items\n(chat cheat commands — requires lobby cheats)"
	)

	constructor() {
		Events.on("SetLanguage", this.SetLanguage.bind(this))
		Events.on("ScriptsUpdated", this.ScriptsUpdated.bind(this))

		EventsSDK.on("Tick", this.Tick.bind(this))
		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("EntityCreated", this.EntityCreated.bind(this))
		EventsSDK.on("HumanizerStateChanged", this.HumanizerStateChanged.bind(this))

		InputEventSDK.on("MouseWheel", this.MouseWheel.bind(this))

		this.tree
			.AddToggle(
				"Humanizer",
				true,
				"Enables all scripts orders, ability to change camera distance"
			)
			.OnValue(toggle => (ExecuteOrder.DisableHumanizer = !toggle.value))

		this.tree
			.AddToggle(
				"Draw2D every frame",
				false,
				"Disables ~30fps caching of persisted 2D blocks\nand rebuilds them every frame (perf comparison)"
			)
			.OnValue(toggle => (RendererSDK.Draw2DThrottleDisabled = toggle.value))

		this.tree
			.AddToggle(
				"Send HP bar offsets",
				true,
				"Ships every unit's HP bar offset to scripts each tick. Disable to test FPS impact"
			)
			.OnValue(toggle => (SendUnitNativeProperties = toggle.value))

		this.menuKeyBind.ActivatesInMenu = true
		this.menuKeyBind.TriggerOnChat = true
		this.menuKeyBind.OnPressed(
			() => (Menu.MenuManager.IsOpen = !Menu.MenuManager.IsOpen)
		)

		const langDD = this.tree.AddDropdown(
			"Language",
			Menu.Localization.Languages.map(l => l[0].toUpperCase() + l.slice(1))
		)
		langDD.IconPath = "menu/icons/lang.svg"
		langDD.KeepArrowGap = false
		langDD.SaveConfig = false
		langDD.executeOnAdd = false
		langDD.OnValue(call => Menu.Localization.SetLang(call.SelectedID))

		this.reloadTree.AddButton("Reload").OnValue(() => reload())
		this.spawnTestHeroes.OnValue(() => this.SpawnTestHeroes())
		this.key.ActivatesInMenu = true
		this.key.OnPressed(() => this.cNotifications.OnBindPressed())
		this.key.OnRelease(() => this.cNotifications.OnBindRelease())
	}

	protected Draw() {
		this.cCamera.Draw()
		this.cConfig.Draw()
		this.cNotifications.Draw()
		this.DrawRendererStats()
	}

	// benchmark scene via console cheat commands (the console equivalents of -createhero /
	// -levelbots / -givebots, see liquipedia dota2game/Cheats): 9 max-level six-slotted heroes
	// for overlay stress tests. Creates are sent one per tick; leveling and items wait until
	// the created heroes actually spawn (they appear with a delay), with a timeout fallback.
	private readonly pendingCommands: string[] = []
	private finishCommands: string[] = []
	private expectedHeroCount = 0
	private spawnTimeoutTicks = 0

	private SpawnTestHeroes() {
		const allies = [
			"npc_dota_hero_lina",
			"npc_dota_hero_axe",
			"npc_dota_hero_pudge",
			"npc_dota_hero_sven"
		]
		const enemies = [
			"npc_dota_hero_invoker",
			"npc_dota_hero_juggernaut",
			"npc_dota_hero_zuus",
			"npc_dota_hero_earthshaker",
			"npc_dota_hero_sniper"
		]
		const items = [
			"item_assault",
			"item_heart",
			"item_butterfly",
			"item_monkey_king_bar",
			"item_skadi",
			"item_satanic"
		]
		for (let i = 0; i < allies.length; i++) {
			this.pendingCommands.push(`dota_create_unit ${allies[i]}`)
		}
		for (let i = 0; i < enemies.length; i++) {
			this.pendingCommands.push(`dota_create_unit ${enemies[i]} enemy`)
		}
		this.expectedHeroCount =
			EntityManager.GetEntitiesByClass(Hero).length +
			allies.length +
			enemies.length
		this.spawnTimeoutTicks = 30 * 15 // ~15s, in case some heroes never network in
		// max the spawned bots; hero_maxlevel additionally maxes the local hero
		this.finishCommands = ["dota_bot_give_level 30", "dota_dev hero_maxlevel"]
		for (let i = 0; i < items.length; i++) {
			this.finishCommands.push(`dota_bot_give_item ${items[i]}`)
		}
	}

	protected Tick() {
		const cmd = this.pendingCommands.shift()
		if (cmd !== undefined) {
			GameState.ExecuteCommand(cmd)
			return
		}
		if (this.finishCommands.length === 0) {
			return
		}
		// wait for the created heroes to actually spawn before leveling / giving items
		const spawned =
			EntityManager.GetEntitiesByClass(Hero).length >= this.expectedHeroCount
		if (spawned || --this.spawnTimeoutTicks <= 0) {
			this.pendingCommands.push(...this.finishCommands)
			this.finishCommands = []
		}
	}

	// debug overlay: renderer command-list sizes + relative-anchor op counts; a shared anchor
	// showing up once in "rel STORE /f" across two scripts confirms the registry dedup
	private DrawRendererStats() {
		if (!this.rendererStats.value) {
			return
		}
		const s = RendererSDK.DebugStats
		const lines = [
			`coords3D buf : ${s.coords3D} B`,
			`draw2D buf   : ${s.draw2D} B`,
			`draw3D buf   : ${s.draw3D} B`,
			`rel STORE /f : ${s.relStores}`,
			`rel LOAD (2D): ${s.relLoads}`,
			`draw2D rate  : ${s.draw2DRate}/s`,
			`frames       : ${s.frameRate}/s`
		]
		const fontSize = 16
		const step = fontSize + 4
		for (let i = 0; i < lines.length; i++) {
			RendererSDK.Text(
				lines[i],
				new Vector2(14, 240 + i * step),
				Color.White,
				RendererSDK.DefaultFontName,
				fontSize
			)
		}
	}

	protected MouseWheel(up: boolean) {
		return this.cCamera.MouseWheel(up)
	}

	protected EntityCreated(entity: Entity) {
		this.cCamera.EntityCreated(entity)
	}

	protected ScriptsUpdated() {
		this.cNotifications.ScriptsUpdated()
		console.info("Scripts Updated...")
	}

	protected HumanizerStateChanged() {
		this.cCamera.HumanizerStateChanged()
	}

	protected SetLanguage(language: MenuLanguageID): void {
		if (this.setLanguageCounter++ || !Menu.Localization.SelectedUnitName) {
			Menu.Localization.SetLang(language)
			// console.info("SetLanguage: ", Menu.Localization.SelectedUnitName)
		}
	}
})()
