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
	MathSDK,
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
	private distanceSave = 0

	constructor(settings: Menu.Node) {
		const treeMenu = settings.AddNode("Camera", "menu/icons/camera.svg")

		this.distance = treeMenu.AddSlider("Camera Distance", 1200, 1200, 3500)

		this.infoState = treeMenu.AddToggle(
			"Draw camera distance",
			false,
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
		this.animationSpeed = treeMenuMouse.AddSlider("Animation speed", 500, 50, 1000)

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

	private clampDistance(distance: number) {
		return MathSDK.Clamp(distance, this.distance.min, this.distance.max)
	}
	private lastFrame = 0
	public Draw(): void {
		if (!this.isInGame) {
			return
		}

		const timeNow = hrtime()
		const frameTime = (timeNow - this.lastFrame) / 1000
		this.lastFrame = timeNow

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

		if (this.disableHumanizer) {
			this.distanceSave = -1
		} else {
			const delta = this.distance.value - this.distanceSave

			if (delta !== 0) {
				this.sleepDrawInfoCameraDistance()

				const step = Math.min(
					this.step.value,
					this.animationSpeed.value * frameTime * 10
				)

				this.distanceSave =
					Math.abs(delta) < step
						? this.distance.value
						: this.clampDistance(this.distanceSave + Math.sign(delta) * step)
			}
		}
		Camera.Distance = this.distanceSave | 0
		ConVarsSDK.Set(
			"r_farz",
			!this.disableHumanizer ? (this.distanceSave * 10) | 0 : -1
		)
	}

	private lastWheelDirection = false
	public MouseWheel(up: boolean): boolean {
		if (
			!this.mouseState.value ||
			this.disableHumanizer ||
			!this.isInGame ||
			GameState.IsInputCaptured
		) {
			return true
		}
		if (this.ctrlState.value && !Input.IsKeyDown(VKeys.CONTROL)) {
			return true
		}

		if (this.lastWheelDirection !== up) {
			this.lastWheelDirection = up

			this.distance.value = this.distanceSave | 0
		}

		this.distance.value += this.step.value * (up ? -1 : 1)
		this.distance.value = this.clampDistance(this.distance.value)

		Menu.Base.SaveConfigASAP = true

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
		this.infoState.value = this.infoState.defaultValue
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
}
