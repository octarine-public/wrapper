import {
	Color,
	Entity,
	Events,
	EventsSDK,
	ExecuteOrder,
	InputEventSDK,
	InputManager,
	Menu,
	Rectangle,
	RendererSDK,
	Vector2
} from "../../../wrapper/Imports"
import { InternalCamera } from "./Camera"
import { InternalChanger } from "./Changer"
import { InternalConfig } from "./Config"
import { InternalNotifications } from "./Notifications"

new (class CInternalSettings {
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
		EventsSDK.after("Draw", this.Draw.bind(this))
		EventsSDK.on("GameStarted", this.GameStarted.bind(this))
		Events.on("ScriptsUpdated", this.ScriptsUpdated.bind(this))
		InputEventSDK.on("MouseWheel", this.MouseWheel.bind(this))
		EventsSDK.on("EntityCreated", this.EntityCreated.bind(this))
		EventsSDK.on("HumanizerStateChanged", this.HumanizerStateChanged.bind(this))

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

		profiler
			.AddDropdown("State", ["Disabled", "All", "Total", "Draw", "Tick"])
			.OnValue(c => {
				EventsSDK.listenerStr = [["Starting profile..."]]
				EventsSDK.listenerStrTime = 0
				EventsSDK.listenerNameFilter =
					c.SelectedID > 1 ? c.ValuesNames[c.SelectedID] : ""
				EventsSDK.listenerStatsMode = !!c.SelectedID
			})
		profiler.AddSlider("Duration, seconds", 1, 1, 30).OnValue(c => {
			EventsSDK.listenerStrTime = 0
			EventsSDK.listenerStatsDuration = c.value * 1000
		})
		profiler.AddSlider("Max lines", 5, 1, 50).OnValue(c => {
			EventsSDK.listenerStrTime = 0
			EventsSDK.listenerMaxLines = c.value
		})
		profiler.AddToggle("Sort by max", true).OnValue(c => {
			EventsSDK.listenerStrTime = 0
			EventsSDK.listenerSortByMax = c.value
		})
		profiler
			.AddKeybind("Start manual hotkey")
			.OnPressed(c => {
				EventsSDK.listenerStatsMode = !EventsSDK.listenerStatsMode
				EventsSDK.listenerStats.clear()
				EventsSDK.listenerNameFilter = ""
				EventsSDK.listenerStr = [["Starting profile..."]]
				EventsSDK.listenerStrTime =
					hrtime() + EventsSDK.listenerStatsDuration + 50
			})
			.OnRelease(c => {
				if (EventsSDK.listenerStatsMode) {
					EventsSDK.listenerStr = [
						[
							"Profiling for " +
							(EventsSDK.listenerStatsDuration / 1000).toFixed() +
							" seconds"
						]
					]
				}
			})
	}

	protected Draw() {
		this.cCamera.Draw()
		this.cConfig.Draw()
		this.cNotifications.Draw()

		if (EventsSDK.listenerStatsMode) {
			const startX = 10
			let y = 100
			const height = 14

			const fontCfg = [undefined, 12, 400, false] as any

			const width = []
			let widthTotal = 0
			const lineHeader = EventsSDK.listenerStr[0]
			for (let i = 0; i < lineHeader.length; i++) {
				const w = RendererSDK.GetTextSize(lineHeader[i], ...fontCfg).x
				widthTotal += w
				width.push(w)
			}
			//width[width.length - 1] = EventsSDK.listenerStr
			//	.map(v => RendererSDK.GetTextSize(v.at(-1) ?? "", ...fontCfg).x)
			//	.reduce((max, v) => (v > max ? v : max))

			const rect = new Rectangle(
				new Vector2(startX, y),
				new Vector2(
					startX + widthTotal,
					y + height * EventsSDK.listenerStr.length
				)
			)
			if (rect.Contains(InputManager.CursorOnScreen)) {
				RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Black)
			}
			for (let i = 0; i < EventsSDK.listenerStr.length; i++) {
				const line = EventsSDK.listenerStr[i]
				let x = startX
				for (let j = 0; j < line.length; j++) {
					const s = line[j]
					const w =
						j === width.length - 1
							? width[j]
							: RendererSDK.GetTextSize(s, ...fontCfg).x
					x += width[j]
					RendererSDK.Text(s, new Vector2(x - w, y), undefined, ...fontCfg)
				}
				y += height
			}
		}
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
})()
