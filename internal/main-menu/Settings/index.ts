import {
	Color,
	Entity,
	Events,
	EventsSDK,
	ExecuteOrder,
	InputEventSDK,
	InputManager,
	Menu,
	RendererSDK,
	Vector2
} from "../../../wrapper/Imports"
import { InternalCamera } from "./Camera"
import { InternalChanger } from "./Changer"
import { InternalConfig } from "./Config"
import { InternalNotifications } from "./Notifications"

EventsSDK.after("Draw", () => {
	if (EventsSDK.StatsRecording) {
		EventsSDK.listenerStrFrameNow++
		const pos = new Vector2(10, 200)

		const lineHeight = 14
		const font = ["Open Sans", 16, 400, false] as any

		const strs = EventsSDK.listenerStr
		const width = EventsSDK.listenerStrWidth

		if (!width.length) {
			for (let i = 0; i < strs.length; i++) {
				width[i] ??= []

				const rows = strs[0].length - 1
				width[i][rows] = 0
				for (let j = 0; j < rows; j++) {
					const s = strs[i][j]
					if (s) {
						const w = RendererSDK.GetTextSize(s, ...font).x

						width[i][j] = w

						if (width[0][j] < w) {
							width[0][j] = w
						}
					}
				}
			}
		}

		const size = new Vector2(
			width[0].reduce((sum, w) => sum + w),
			lineHeight * strs.length
		)
		if (InputManager.CursorOnScreen.IsUnderRectangle(pos.x, pos.y, size.x, size.y)) {
			RendererSDK.FilledRect(pos, size, Color.Black)
		}

		const startX = pos.x
		for (let i = 0; i < strs.length; i++) {
			for (let s = width[0].length, j = 0; j < s; j++) {
				pos.x += width[0][j] ?? 0
				pos.x -= width[i][j] ?? 0
				RendererSDK.Text(strs[i][j], pos, undefined, ...font, true)
				pos.x += width[i][j] ?? 0
			}
			pos.x = startX
			pos.y += lineHeight
		}
	}
})

new (class CInternalSettings {
	private setLanguageCounter = 0
	private readonly tree = Menu.AddEntry("Settings")
	private readonly cCamera = new InternalCamera(this.tree)
	private readonly cChanger = new InternalChanger(this.tree)
	private readonly cNotifications = new InternalNotifications(this.tree)
	private readonly cConfig = new InternalConfig(this.tree)

	private readonly reloadTree = this.tree.AddNode(
		"Reload Scripts",
		"menu/icons/reload.svg"
	)

	private readonly menuKeyBind = this.tree.AddKeybind("Menu Bind", "Insert")
	private readonly key = this.reloadTree.AddKeybind("Key Bind")

	constructor() {
		console.log("CInternalSettings", new Error().stack)
		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("GameStarted", this.GameStarted.bind(this))

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

		const profiler = this.tree.AddNode("Events Profiler")

		profiler.AddToggle("State").OnValue(c => (EventsSDK.StatsRecording = c.value))
		profiler
			.AddDropdown("Filter Exclusive", ["Disabled", "Total", "Draw", "Tick"])
			.OnValue(c => {
				EventsSDK.restartProfile()
				if (c.SelectedID === 1) {
					EventsSDK.StatsTotal = true
				}
				EventsSDK.StatsFilterName = c.SelectedID
					? c.InternalValuesNames[c.SelectedID]
					: ""
			})

		profiler.AddToggle("Event total", false).OnValue(c => {
			EventsSDK.StatsTotal = c.value
			EventsSDK.restartProfile()
		})
		profiler.AddToggle("Sort by max", false).OnValue(c => {
			EventsSDK.listenerSortByMax = c.value
			EventsSDK.restartProfile()
		})
		profiler.AddSlider("threshhold, Total%", 1, 0, 25).OnValue(c => {
			EventsSDK.StatsFilterThreshholdTotal = c.value
			EventsSDK.restartProfile()
		})
		profiler.AddSlider("threshhold, Max ms", 1, 0, 25).OnValue(c => {
			EventsSDK.StatsFilterThreshholdMax = c.value
			EventsSDK.restartProfile()
		})
		profiler.AddSlider("Lines", 5, 1, 50).OnValue(c => {
			EventsSDK.listenerMaxLines = c.value
			EventsSDK.restartProfile()
		})
		profiler.AddSlider("Duration", 1, 1, 30).OnValue(c => {
			EventsSDK.StatsDuration = c.value * 1000
			EventsSDK.restartProfile()
		})
	}

	protected Draw() {
		this.cCamera.Draw()
		this.cConfig.Draw()
		this.cNotifications.Draw()
	}
	protected MouseWheel(up: boolean) {
		return this.cCamera.MouseWheel(up)
	}

	protected GameStarted() {
		this.cChanger.GameStarted()
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
