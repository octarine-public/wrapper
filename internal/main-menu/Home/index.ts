import {
	Color,
	ConVarsSDK,
	Events,
	EventsSDK,
	InputManager,
	MathSDK,
	Menu,
	MenuLanguageID,
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

new (class CInternalMainMenu {
	private trailHue = 0
	private acceptTime = -1
	private maxTrailLength = 50
	private trailPositions: Vector2[] = []

	private readonly tree = Menu.AddEntry("Main")
	private readonly rgbTrail = this.tree.AddToggle("RGB trail", false, "RGB mouse trail")

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
		Events.on("SetLanguage", this.SetLanguage.bind(this))
		EventsSDK.on("SharedObjectChanged", this.SharedObjectChanged.bind(this))
	}

	protected Draw(): void {
		this.trailMouse()
		this.updateAutoAccept()
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

	protected SetLanguageCounter = 0
	protected SetLanguage(language: MenuLanguageID): void {
		if (this.SetLanguageCounter++ || !Menu.Localization.SelectedUnitName) {
			Menu.Localization.SetLang(language)
			console.info("SetLanguage: ", Menu.Localization.SelectedUnitName)
		}
	}

	private updateAutoAccept() {
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
		if (!this.rgbTrail.value) {
			this.trailHue = 0
			this.trailPositions.clear()
			return
		}

		this.trailHue = (this.trailHue + 1) % 360
		this.trailPositions.push(InputManager.CursorOnScreen)

		if (this.trailPositions.length > this.maxTrailLength) {
			this.trailPositions.shift()
		}

		const trailLength = this.trailPositions.length,
			lineColor = new Color(...MathSDK.HSVToRGB(this.trailHue, 1, 1, true, true))

		for (let i = 1; i < trailLength; i++) {
			const start = this.trailPositions[i - 1],
				end = this.trailPositions[i],
				alpha = (i / trailLength) * 255

			const width = Math.max(
				1,
				// 10 * Math.exp(-3 * (trailLength - i) / trailLength),
				12 * Math.pow(1 - (trailLength - i) / trailLength, 2)
			)
			// smoothing out gaps
			const steps = Math.ceil(start.Distance(end) / 2)
			for (let j = 0; j <= steps; j++) {
				const lerpFactor = j / steps
				const startPoint = start.Lerp(end, lerpFactor)
				const endPoint = start.Lerp(end, (lerpFactor + 1 / steps) % 1)
				RendererSDK.Line(startPoint, endPoint, lineColor.SetA(alpha), width)
			}
		}
	}
})()
