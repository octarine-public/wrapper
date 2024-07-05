import {
	Color,
	ConVarsSDK,
	DOTAGameState,
	DOTAGameUIState,
	Entity,
	ExecuteOrder,
	GameRules,
	GameState,
	GUIInfo,
	Input,
	LocalPlayer,
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

	private readonly infoState: Menu.Toggle
	private readonly mouseState: Menu.Toggle
	private readonly ctrlState: Menu.Toggle

	private readonly distance: Menu.Slider
	private readonly animationSpeed: Menu.Slider

	private readonly angles: {
		readonly node: Menu.Node
		readonly X: Menu.Slider
		readonly Y: Menu.Slider
		readonly Vector: Vector2
	}

	private readonly sleepTime = 2 * 1000
	private readonly sleeper = new Sleeper()

	private startTime: Nullable<number>
	private animating: boolean = false
	private startValue: number = 0
	private endValue: number = 0

	constructor(settings: Menu.Node) {
		const treeMenu = settings.AddNode("Camera", "menu/icons/camera.svg")

		this.distance = treeMenu.AddSlider("Camera Distance", 1200, 1200, 3500)

		this.infoState = treeMenu.AddToggle(
			"Draw camera distance",
			true,
			"Draw info camera distance\non mouse wheel"
		)

		this.angles = treeMenu.AddVector2(
			"Camera Angles",
			new Vector2(60, 0),
			new Vector2(1, 0),
			new Vector2(180, 360)
		)

		this.inverseDire = this.angles.node.AddToggle("Inverse for Dire", false)

		const treeMenuMouse = treeMenu.AddNode("Mouse wheel")
		this.mouseState = treeMenuMouse.AddToggle("State", false)
		this.ctrlState = treeMenuMouse.AddToggle("Change if Ctrl is down", true)
		this.step = treeMenuMouse.AddSlider("Camera Step", 200, 50, 1000)
		this.animationSpeed = treeMenuMouse.AddSlider("Animation speed", 0, 0, 1500)

		treeMenu
			.AddButton("Reset", "Reset settings")
			.OnValue(() => this.resetCameraSettings())
	}

	private get disableHumanizer(): boolean {
		return ExecuteOrder.DisableHumanizer
	}

	private get isInGame(): boolean {
		if (GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME) {
			return false
		}
		if (
			GameRules !== undefined &&
			(GameRules.GameState < DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME ||
				GameRules.GameState > DOTAGameState.DOTA_GAMERULES_STATE_POST_GAME)
		) {
			return false
		}
		return true
	}

	public Draw(): void {
		if (!this.isInGame) {
			return
		}

		this.drawCameraDistance()

		if (!this.disableHumanizer) {
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

		this.setDisableZoom()
		this.updateAnimation()

		Camera.Distance = !this.disableHumanizer ? this.distance.value : -1
		ConVarsSDK.Set("r_farz", !this.disableHumanizer ? this.distance.value * 10 : -1)
	}

	public MouseWheel(up: boolean): boolean {
		if (!this.mouseState.value || this.disableHumanizer || !this.isInGame) {
			return true
		}
		if (this.ctrlState.value && !Input.IsKeyDown(VKeys.CONTROL)) {
			return true
		}
		Menu.Base.SaveConfigASAP = true
		let newValue = (this.startValue = this.distance.value)
		if (up) {
			newValue -= this.step.value
		} else {
			newValue += this.step.value
		}
		this.animating = true
		this.startTime = hrtime()
		this.endValue = Math.min(Math.max(newValue, this.distance.min), this.distance.max)
		this.sleepDrawInfoCameraDistance()
		return false
	}

	public HumanizerStateChanged() {
		this.sleepDrawInfoCameraDistance()
	}

	public EntityCreated(entity: Entity) {
		if (entity === LocalPlayer?.Hero) {
			this.sleepDrawInfoCameraDistance()
		}
	}

	private resetCameraSettings() {
		this.step.value = this.step.defaultValue
		this.distance.value = this.distance.defaultValue
		this.angles.X.value = this.angles.X.defaultValue
		this.angles.Y.value = this.angles.Y.defaultValue
		this.mouseState.value = this.mouseState.defaultValue
		this.inverseDire.value = this.inverseDire.defaultValue
		this.ctrlState.value = this.ctrlState.defaultValue
		this.animationSpeed.value = this.animationSpeed.defaultValue
		this.sleepDrawInfoCameraDistance()
	}

	private drawCameraDistance() {
		if (!this.sleeper.Sleeping("Camera")) {
			return
		}

		const remaining = this.sleeper.RemainingSleepTime("Camera")
		const color = Color.White.SetA(Math.min(remaining / 1000, 1) * 255)
		const dist = Math.max(Camera.Distance, this.distance.min)
		const text = `${Menu.Localization.Localize("Camera distance")}: ${Math.floor(dist)}`

		const textSize = GUIInfo.ScaleHeight(48)
		const windowSize = RendererSDK.WindowSize
		const halfWindowSize = windowSize.DivideScalar(2)
		const getTextSize = RendererSDK.GetTextSize(
			text,
			RendererSDK.DefaultFontName,
			textSize,
			600
		)
		const position = halfWindowSize.SubtractScalarY(
			windowSize.y / 2 - getTextSize.y / 2
		)
		position.SubtractScalarX(getTextSize.x / 2)
		position.AddScalarY(GUIInfo.ScaleHeight(175))
		RendererSDK.Text(
			text,
			position,
			color,
			RendererSDK.DefaultFontName,
			textSize,
			600
		)
	}

	private sleepDrawInfoCameraDistance() {
		if (this.infoState.value) {
			this.sleeper.Sleep(this.sleepTime, "Camera")
		}
	}

	private setDisableZoom() {
		if (!this.disableHumanizer) {
			ConVarsSDK.Set("dota_camera_disable_zoom", true)
		}
	}

	public updateAnimation(): void {
		if (!this.animating) {
			return
		}

		const currentTime = hrtime()
		const duration = Math.max(this.animationSpeed.value, 100)
		const timeElapsed = currentTime - (this.startTime ?? 0)

		if (timeElapsed < duration) {
			const start = this.startValue
			const end = this.endValue
			const progress = this.easeInOutQuad(timeElapsed / duration)
			this.distance.value = start + (end - start) * progress
		} else {
			this.distance.value = this.endValue
			this.animating = false
		}
	}

	private easeInOutQuad(t: number): number {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
	}
}
