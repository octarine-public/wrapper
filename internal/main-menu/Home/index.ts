import {
	Color,
	ConVarsSDK,
	DOTAGameUIState,
	EventsSDK,
	GameRules,
	GameState,
	InputManager,
	MathSDK,
	Menu,
	RendererSDK,
	SOType,
	Vector2
} from "../../../wrapper/Imports"

const enum CSODOTALobbyState {
	UI = 0,
	READYUP = 4,
	SERVERSETUP = 1,
	RUN = 2,
	POSTGAME = 3,
	NOTREADY = 5,
	SERVERASSIGN = 6
}

class RGBTrailMenu {
	public readonly Type: Menu.Dropdown
	public readonly Smoothing: Menu.Toggle

	public readonly Color: Menu.ColorPicker
	public readonly Animate: Menu.Toggle
	public readonly MaxLength: Menu.Slider

	private readonly state: Menu.Toggle
	private readonly whereToUse: Menu.Dropdown

	private readonly tree: Menu.Node
	private readonly icon = "images/icons/interactive.svg"

	private readonly arrUse = ["Always", "Only in menu", "Only in game"]

	constructor(node: Menu.Node) {
		this.tree = node.AddNode("RGB trail", this.icon, "RGB mouse trail")
		this.tree.SortNodes = false
		this.state = this.tree.AddToggle("State", true)
		this.Smoothing = this.tree.AddToggle("Smoothing", true)
		this.Animate = this.tree.AddToggle("RGB animate", true)
		this.Color = this.tree.AddColorPicker("Color", Color.Aqua.SetA(255))
		this.Type = this.tree.AddDropdown("Shape", ["Circle", "Line"])
		this.whereToUse = this.tree.AddDropdown("Use", this.arrUse)
		this.MaxLength = this.tree.AddSlider("Max length", 50, 15, 50)
		this.Animate.OnValue(toggle => (this.Color.IsHidden = toggle.value))
	}

	public get State() {
		if (!this.state.value) {
			return false
		}
		const SelectedID = this.whereToUse.SelectedID
		if (SelectedID === 0) {
			return true
		}
		const isMainMenu =
			GameRules === undefined ||
			GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME
		return (SelectedID === 1 && isMainMenu) || (SelectedID === 2 && !isMainMenu)
	}
}

new (class CInternalMainMenu {
	private trailHue = 0
	private acceptTime = -1
	private readonly trailPositions: Vector2[] = []

	private readonly tree = Menu.AddEntry("Main")
	private readonly rgbTrail = new RGBTrailMenu(this.tree)

	private readonly acceptDelay = this.tree.AddSlider(
		"AutoAccept delay",
		26,
		0,
		28,
		0,
		"Delay on auto accept,\nyou can disable it by setting slider to max value"
	)

	constructor() {
		this.tree
			.AddToggle("Trigger keybinds in chat", false)
			.OnValue(toggle => (Menu.Base.triggerOnChat = toggle.value))

		this.rgbTrail.MaxLength.OnValue(_ => this.trailPositions.clear())

		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("SharedObjectChanged", this.SharedObjectChanged.bind(this))
	}

	protected Draw(): void {
		this.trailMouse()
		this.autoAccept()
		ConVarsSDK.Set("fog_override", 0)
		ConVarsSDK.Set("fog_enable", false)
		ConVarsSDK.Set("fow_client_visibility", 0)
	}

	protected SharedObjectChanged(
		_typeID: SOType,
		_reason: number,
		msg: RecursiveMap
	): void {
		if (msg.get("state") === CSODOTALobbyState.READYUP && this.acceptTime === -1) {
			this.acceptTime = hrtime()
		} else if (
			this.acceptTime !== -1 &&
			msg.get("state") !== CSODOTALobbyState.READYUP
		) {
			this.acceptTime = -1
		}
	}

	private autoAccept() {
		if (this.acceptTime === -1) {
			return
		}
		const elepsedTime = (hrtime() - this.acceptTime) / 1000
		if (elepsedTime > this.acceptDelay.max) {
			this.acceptTime = -1
			return
		}
		if (this.acceptDelay.value - elepsedTime > 0) {
			return
		}
		AcceptMatch()
		this.acceptTime = -1
	}

	private trailMouse() {
		if (!this.rgbTrail.State) {
			this.trailHue = 0
			this.trailPositions.clear()
			return
		}

		const cursor = InputManager.CursorOnScreen
		this.trailHue = (this.trailHue + 1) % 360
		this.trailPositions.push(cursor)

		if (this.trailPositions.length >= this.rgbTrail.MaxLength.value) {
			this.trailPositions.shift()
		}

		const trailLength = this.trailPositions.length,
			color = this.rgbTrail.Animate.value
				? new Color(...MathSDK.HSVToRGB(this.trailHue, 1, 1, true, true))
				: this.rgbTrail.Color.SelectedColor.Clone()

		for (let i = 1; i < trailLength; i++) {
			const start = this.trailPositions[i - 1],
				end = this.trailPositions[i],
				alpha = (i / trailLength) * 255,
				width = Math.max(12 * Math.pow(1 - (trailLength - i) / trailLength, 2), 2)
			if (start.Distance(cursor) <= 1 / 2) {
				break
			}
			const vecWidth = new Vector2(width, width)
			if (!this.rgbTrail.Smoothing.value) {
				this.trailType(start, end, vecWidth, color.SetA(alpha))
				continue
			}
			// smoothing out gaps
			const steps = Math.ceil(start.Distance(end) / 2)
			for (let j = 0; j <= steps; j++) {
				const lerpFactor = j / steps
				const startPoint = start.Lerp(end, lerpFactor)
				const endPoint = start.Lerp(end, (lerpFactor + 1 / steps) % 1)
				this.trailType(startPoint, endPoint, vecWidth, color.SetA(alpha))
			}
		}
	}
	private trailType(start: Vector2, end: Vector2, vecWidth: Vector2, color: Color) {
		if (this.rgbTrail.Type.SelectedID === 1) {
			RendererSDK.Line(start, end, color, vecWidth.x)
			return
		}
		const position = start.Subtract(vecWidth.DivideScalar(2))
		RendererSDK.FilledCircle(position, vecWidth, color)
	}
})()
