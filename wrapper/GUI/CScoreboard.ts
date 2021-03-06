import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import GUIInfo from "./GUIInfo"

export default class CScoreboard {
	public readonly Background = new Rectangle()

	constructor(screen_size: Vector2) {
		this.CalculateBackground(screen_size)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Background.pos1, this.Background.Size, Color.White.SetA(128))
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateBackground(screen_size: Vector2): void {
		this.Background.Width = GUIInfo.ScaleWidth(762, screen_size)
		this.Background.Height = GUIInfo.ScaleHeight(680, screen_size)
		this.Background.x = 0
		this.Background.y = GUIInfo.ScaleHeight(54, screen_size)
	}
}
