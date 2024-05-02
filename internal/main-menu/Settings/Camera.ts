import {
	Color,
	ConVarsSDK,
	DOTAGameUIState,
	ExecuteOrder,
	GameState,
	GUIInfo,
	Input,
	Menu,
	RendererSDK,
	Sleeper,
	Team,
	Vector2,
	VKeys
} from "../../../wrapper/Imports"

/** Camera Menu Manager  */
export class InternalCamera {
	private readonly step: Menu.Slider
	private readonly inverseDire: Menu.Toggle

	private readonly mouseState: Menu.Toggle
	private readonly ctrlState: Menu.Toggle

	private readonly distance: Menu.Slider
	private readonly angles: {
		readonly node: Menu.Node
		readonly X: Menu.Slider
		readonly Y: Menu.Slider
		readonly Vector: Vector2
	}

	private readonly sleepTime = 2 * 1000
	private readonly sleeper = new Sleeper()

	constructor(settings: Menu.Node) {
		const treeMenu = settings.AddNode("Camera", "menu/icons/camera.svg")

		this.distance = treeMenu.AddSlider("Camera Distance", 1200, 1200, 3500)
		this.angles = treeMenu.AddVector2(
			"Camera Angles",
			new Vector2(60, 0),
			new Vector2(1, 0),
			new Vector2(180, 360)
		)

		this.inverseDire = this.angles.node.AddToggle("Inverse for Dire", false)
		const treeMenuMouse = treeMenu.AddNode("Mouse wheel")

		this.mouseState = treeMenuMouse.AddToggle("State", true)
		this.ctrlState = treeMenuMouse.AddToggle("Change if Ctrl is down", true)
		this.step = treeMenuMouse.AddSlider("Camera Step", 50, 10, 1000)

		treeMenu
			.AddButton("Reset", "Reset settings")
			.OnValue(() => this.OnResetCameraSettings())
	}

	public Draw(): void {
		const disableHumanizer = ExecuteOrder.DisableHumanizer

		this.drawCameraDistance()

		if (!disableHumanizer) {
			this.angles.Vector.toIOBuffer()

			if (this.inverseDire.value && GameState.LocalTeam === Team.Dire) {
				IOBuffer[1] -= 180
			}
		} else {
			IOBuffer[0] = 60
			IOBuffer[1] = 0
		}

		IOBuffer[2] = 0
		Camera.Angles = true
		Camera.Distance = !disableHumanizer ? this.distance.value : -1
		ConVarsSDK.Set("r_farz", !disableHumanizer ? this.distance.value * 10 : -1)
	}

	public onMouseWheel(up: boolean): boolean {
		if (!this.mouseState.value || ExecuteOrder.DisableHumanizer) {
			return true
		}
		if (GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME) {
			return true
		}
		if (this.ctrlState.value && !Input.IsKeyDown(VKeys.CONTROL)) {
			return true
		}
		let camDist = this.distance.value
		if (up) {
			camDist -= this.step.value
		} else {
			camDist += this.step.value
		}
		this.distance.value = Math.min(
			Math.max(camDist, this.distance.min),
			this.distance.max
		)
		Menu.Base.SaveConfigASAP = true
		this.sleeper.Sleep(this.sleepTime, "Camera")
		return false
	}

	public HumanizerStateChanged() {
		this.sleeper.Sleep(this.sleepTime, "Camera")
	}

	protected OnResetCameraSettings() {
		this.step.value = this.step.defaultValue
		this.distance.value = this.distance.defaultValue
		this.angles.X.value = this.angles.X.defaultValue
		this.angles.Y.value = this.angles.Y.defaultValue
		this.mouseState.value = this.mouseState.defaultValue
		this.inverseDire.value = this.inverseDire.defaultValue
		this.ctrlState.value = this.ctrlState.defaultValue
		this.sleeper.Sleep(this.sleepTime, "Camera")
	}

	private drawCameraDistance() {
		if (!this.sleeper.Sleeping) {
			return
		}

		const remaining = this.sleeper.RemainingSleepTime("Camera")
		const color = Color.White.SetA(Math.min(remaining / 1000, 1) * 255)
		const dist = Math.max(Camera.Distance, this.distance.min)
		const text = `${Menu.Localization.Localize("Camera distance")}: ${dist}`

		const size = GUIInfo.ScaleHeight(48)
		const wSize = RendererSDK.WindowSize.Clone()
		const windowSize = wSize.DivideScalar(2)
		const textSize = RendererSDK.GetTextSize(
			text,
			RendererSDK.DefaultFontName,
			size,
			600
		)
		const position = windowSize.SubtractScalarY(wSize.y / 2 - textSize.y / 2)
		position.SubtractScalarX(textSize.x / 2)
		position.AddScalarY(GUIInfo.ScaleHeight(175))
		RendererSDK.Text(text, position, color, RendererSDK.DefaultFontName, size, 600)
	}
}
