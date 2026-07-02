import {
	Color,
	Entity,
	Events,
	EventsSDK,
	ExecuteOrder,
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

	constructor() {
		Events.on("SetLanguage", this.SetLanguage.bind(this))
		Events.on("ScriptsUpdated", this.ScriptsUpdated.bind(this))

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
