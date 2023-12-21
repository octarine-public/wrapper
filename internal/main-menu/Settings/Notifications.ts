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
	private readonly tree: Menu.Node
	private readonly stateScripts: Menu.Toggle
	private readonly clickState: Menu.Toggle

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

	public onDraw(): void {
		NotificationsSDK.debug = this.tree.IsOpen
	}

	public ScriptsUpdated(): void {
		if (this.stateScripts.value) {
			NotificationsSDK.Push(new ScriptsUpdated(this.clickState.value))
		}
	}
}

class ScriptsUpdated extends Notification {
	constructor(private readonly clickState: boolean) {
		super({ timeToShow: 6 * 1000 })
	}

	public OnClick(): boolean {
		if (!this.clickState) {
			return false
		}
		reload()
		return true
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
		const Text = Menu.Localization.Localize("Scripts update is ready")
		const textSize = RendererSDK.GetTextSize(
			Text,
			RendererSDK.DefaultFontName,
			textFontSize
		)

		Position.AddScalarX(infoSize + textPadding)
		Position.AddScalarY((infoSize - textSize.y - textSize.z) / 2)
		RendererSDK.Text(
			Text,
			Position,
			opacityWhite,
			RendererSDK.DefaultFontName,
			textFontSize
		)
	}
}
