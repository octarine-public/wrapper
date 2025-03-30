import {
	Color,
	ConVarsSDK,
	DOTAGameUIState,
	EventsSDK,
	GameRules,
	GameState,
	GUIInfo,
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
	// public readonly Type: Menu.Dropdown
	public readonly Smoothing: Menu.Toggle

	public readonly Color: Menu.ColorPicker
	public readonly Animate: Menu.Toggle
	public readonly MaxDuration: Menu.Slider
	public readonly ColorChangeSpeed: Menu.Slider
	public readonly Size: Menu.Slider

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
		// this.Type = this.tree.AddDropdown("Shape", ["Circle", "Line"])
		this.whereToUse = this.tree.AddDropdown("Use", this.arrUse)
		this.MaxDuration = this.tree.AddSlider("Max duration", 0.2, 0.1, 5, 1)
		this.ColorChangeSpeed = this.tree.AddSlider("Color change speed", 10, 2, 20)
		this.Size = this.tree.AddSlider("Size", 12, 4, 16)
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
	private acceptTime = -1
	private readonly trailPositions: {
		position: Vector2
		hue: number
		time: number
	}[] = []

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
			this.trailPositions.clear()
			return
		}

		const cursor = InputManager.CursorOnScreen
		const time = hrtime()
		if (
			this.trailPositions.length === 0 ||
			this.trailPositions[this.trailPositions.length - 1].position.Distance(
				cursor
			) >
				1 / 2
		) {
			this.trailPositions.push({
				position: cursor,
				hue: (time * (this.rgbTrail.ColorChangeSpeed.value / 100)) % 360,
				time
			})
		}

		const maxDurationMS = this.rgbTrail.MaxDuration.value * 1000
		while (
			this.trailPositions.length > 2 &&
			time - this.trailPositions[0].time > maxDurationMS
		) {
			this.trailPositions.shift()
		}

		const trailLength = this.trailPositions.length

		const scaledWidth = GUIInfo.ScaleWidth(this.rgbTrail.Size.value)
		for (let i = 1; i < trailLength; i++) {
			const start = this.trailPositions[i - 1],
				end = this.trailPositions[i]
			if (!this.rgbTrail.Smoothing.value) {
				const alpha = 255
				const color = this.rgbTrail.Animate.value
					? new Color(
							...MathSDK.HSVToRGB(
								this.trailPositions[i].hue,
								1,
								1,
								true,
								true
							),
							alpha
						)
					: this.rgbTrail.Color.SelectedColor.Clone().SetA(alpha)
				if (time - end.time >= maxDurationMS) {
					continue
				}
				const width = Math.max(
						scaledWidth * Math.pow(1 - (time - end.time) / maxDurationMS, 2),
						2
					),
					vecWidth = new Vector2(width, width)
				this.trailType(start.position, end.position, vecWidth, color)
				continue
			}
			// smoothing out gaps
			const step = Math.min(
				(scaledWidth * Math.smoothStep(1 - (time - start.time) / maxDurationMS)) /
					2,
				2
			)
			if (step < 1) {
				continue
			}
			const steps = Math.ceil(start.position.Distance(end.position) / step)
			const shortestAngle = ((end.hue - start.hue + 540) % 360) - 180
			for (let j = 0; j < steps; j++) {
				const lerpFactor = j / steps
				const lerpFactorNext = ((j + 1) / steps) % 1
				const lerpFactorTime = Math.smoothStep(
					1 -
						(time - Math.lerp(start.time, end.time, lerpFactor)) /
							maxDurationMS
				)
				const width = scaledWidth * lerpFactorTime * lerpFactorTime
				if (width < 2) {
					continue
				}
				const alpha = 255
				const color = this.rgbTrail.Animate.value
					? new Color(
							...MathSDK.HSVToRGB(
								(360 +
									start.hue +
									shortestAngle * Math.smoothStep(lerpFactor)) %
									360,
								1,
								1,
								true,
								true
							),
							alpha
						)
					: this.rgbTrail.Color.SelectedColor.Clone().SetA(alpha)
				const startPoint = start.position.Lerp(end.position, lerpFactor)
				const endPoint = start.position.Lerp(end.position, lerpFactorNext)
				this.trailType(startPoint, endPoint, new Vector2(width, width), color)
			}
		}
	}
	private trailType(start: Vector2, end: Vector2, vecWidth: Vector2, color: Color) {
		// if (this.rgbTrail.Type.SelectedID === 1) {
		// 	RendererSDK.Line(start, end, color, vecWidth.x * 2)
		// 	return
		// }
		const position = start.Subtract(vecWidth.DivideScalar(2))
		RendererSDK.FilledCircle(position, vecWidth, color)
	}
})()
