import {
	Color,
	GUIInfo,
	Menu,
	Notification,
	NotificationsSDK,
	Rectangle,
	RendererSDK,
	Vector2
} from "../../../wrapper/Imports"

export class InternalNotifications {
	private pressStart = 0
	private ScriptLatest = true
	private AutoReload: Nullable<ScriptsUpdated>

	private readonly holdMs = 1000

	private readonly tree: Menu.Node
	private readonly stateScripts: Menu.Toggle
	private readonly clickState: Menu.Toggle
	private readonly autoReloadState: Menu.Toggle

	constructor(settings: Menu.Node) {
		const icon = "menu/icons/notification.svg"

		this.tree = settings.AddNode("Notifications", icon)
		this.tree.SortNodes = false

		const treeScripts = this.tree.AddNode("Updates notifications", icon)

		this.stateScripts = treeScripts.AddToggle(
			"State",
			false,
			"Notifications if scripts updated"
		)

		this.clickState = treeScripts.AddToggle(
			"Reload on click",
			true,
			"Reload scripts on click on notification"
		)
		this.autoReloadState = treeScripts
			.AddToggle("Auto reload on update", false)
			.OnValue(t => {
				t.IsHidden = !t.value
				if (t.value !== !!this.AutoReload) {
					// force switching the mode in OnDraw
					this.pressStart = hrtime() - this.holdMs * 2
				}
			})

		this.tree
			.AddDropdown("Background cover", ["Octarine", "Dota 2"])
			.OnValue(slider => (NotificationsSDK.backgroundCover = slider.SelectedID))

		this.tree
			.AddSlider("Width", NotificationsSDK.size, 175, 350)
			.OnValue(slider => (NotificationsSDK.size = slider.value))

		this.tree
			.AddSlider("New Height offset", NotificationsSDK.yOffset, 0, 700)
			.OnValue(slider => (NotificationsSDK.yOffset = slider.value))

		this.tree
			.AddSlider("Limit", NotificationsSDK.limit, 2, 6)
			.OnValue(slider => (NotificationsSDK.limit = slider.value))
	}

	public Draw(): void {
		NotificationsSDK.debug = this.tree.IsOpen

		if (!this.pressStart) {
			return
		}

		const ms = hrtime()
		if (
			this.pressStart > ms - this.holdMs * 30 &&
			this.pressStart < ms - this.holdMs
		) {
			this.pressStart = 0

			const newState = !this.AutoReload
			const max = ms + (1 << 24)
			this.AutoReload = new ScriptsUpdated(this.clickState.value, () => {
				this.autoReloadState.value = false
				this.autoReloadState.TriggerOnValueChangedCBs()
			})
			this.AutoReload.StartDisplayTime = newState ? ms : max
			this.AutoReload.StopDisplayTime = newState ? max : ms

			NotificationsSDK.Push(this.AutoReload, true)

			if (!newState) {
				this.AutoReload = undefined
			}
			if (this.autoReloadState.value !== newState) {
				this.autoReloadState.value = newState
				this.autoReloadState.TriggerOnValueChangedCBs()
				Menu.Base.SaveConfigASAP = true
			}
		}
	}

	public OnBindPressed() {
		if (this.ScriptLatest) {
			this.pressStart = hrtime()
			return
		}
		reload()
	}
	public OnBindRelease() {
		if (hrtime() - this.pressStart < this.holdMs) {
			reload()
		}
		this.pressStart = 0
	}
	public ScriptsUpdated(): void {
		this.ScriptLatest = false
		if (this.stateScripts.value) {
			NotificationsSDK.Push(new ScriptsUpdated(this.clickState.value))

			if (this.AutoReload) {
				reload()
			}
		}
	}
}

class ScriptsUpdated extends Notification {
	constructor(
		private readonly clickState: boolean,
		private readonly stopAutoReload?: () => void
	) {
		super({
			timeToShow: stopAutoReload === undefined ? 0 : 6 * 1000,
			uniqueKey: stopAutoReload === undefined ? "AutoReload" : undefined
		})
	}

	public OnClick(): boolean {
		return this.stopAutoReload !== undefined
			? (this.stopAutoReload(), true)
			: (reload(), this.clickState)
	}

	public Draw(position: Rectangle): void {
		const opacity = this.Opacity
		const opacityWhite = Color.White.SetA(opacity)

		RendererSDK.Image(
			"menu/background_inactive.svg",
			position.pos1,
			-1,
			position.Size,
			opacityWhite
		)

		const width = position.Width,
			height = position.Height

		const infoPadding = Math.ceil(width * 0.05),
			infoSize = Math.ceil(position.Height / 2)
		const Position = position.pos1
			.Clone()
			.AddScalarX(infoPadding)
			.AddScalarY((height - infoSize) / 2)
		RendererSDK.Image(
			"menu/icons/info.svg",
			Position,
			-1,
			new Vector2(infoSize, infoSize),
			new Color(104, 4, 255, opacity)
		)

		const textFontSize = GUIInfo.ScaleHeight(11)
		const textPadding = Math.ceil(infoPadding / 2)

		let text: Nullable<string>
		if (this.stopAutoReload !== undefined) {
			const waitingS = 0 | ((hrtime() - this.StartDisplayTime) / 1000)
			const waitingM = 0 | (waitingS / 60)
			text =
				"Auto reload is ON.\nClick to disable.\nWaiting for " +
				(waitingM ? waitingM + " minutes" : waitingS + " seconds")
		} else {
			text = Menu.Localization.Localize("Scripts update is ready")
		}
		const textSize = RendererSDK.GetTextSize(
			text,
			RendererSDK.DefaultFontName,
			textFontSize
		)

		Position.AddScalarX(infoSize + textPadding)
		Position.AddScalarY((infoSize - textSize.y - textSize.z) / 2)
		RendererSDK.Text(
			text,
			Position,
			opacityWhite,
			RendererSDK.DefaultFontName,
			textFontSize,
			undefined,
			undefined,
			false
		)
	}
}
