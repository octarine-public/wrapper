import {
	ConVarsSDK,
	DOTAGameUIState,
	ExecuteOrder,
	GameRules,
	GameState,
	Input,
	Menu,
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
		node: Menu.Node
		X: Menu.Slider
		Y: Menu.Slider
		Vector: Vector2
	}

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

	public onDraw(): void {
		const cameraHacks = !ExecuteOrder.DisableHumanizer

		if (cameraHacks) {
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
		Camera.Distance = cameraHacks ? this.distance.value : -1
		ConVarsSDK.Set("r_farz", cameraHacks ? this.distance.value * 10 : -1)
	}

	public onMouseWheel(up: boolean): boolean {
		if (!this.mouseState.value || !GameRules?.IsInGame) {
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
		return false
	}

	protected OnResetCameraSettings() {
		this.step.value = 50
		this.distance.value = 1200
		this.angles.X.value = 60
		this.angles.Y.value = 0
		this.mouseState.value = false
		this.inverseDire.value = false
		this.ctrlState.value = false
	}
}
