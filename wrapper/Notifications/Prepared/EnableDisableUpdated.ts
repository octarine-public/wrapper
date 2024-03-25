import { Color } from "../../Base/Color"
import { Rectangle } from "../../Base/Rectangle"
import { Vector2 } from "../../Base/Vector2"
import { GUIInfo } from "../../GUI/GUIInfo"
import { RendererSDK } from "../../Native/RendererSDK"
import { Notification } from "../AbstractNotification"

export class EnableDisableUpdated extends Notification {
	constructor(
		private readonly text: string,
		private readonly infoColor: Color,
		timeToShow: number = 4 * 1000
	) {
		super({ timeToShow, uniqueKey: "EnableDisableUpdated" })
	}

	public OnClick(): boolean {
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
			"/menu/icons/check.svg",
			Position,
			-1,
			new Vector2(infoSize, infoSize),
			this.infoColor.SetA(opacity)
		)

		const textPadding = Math.ceil(infoPadding / 2),
			textFontSize = GUIInfo.ScaleHeight(11)
		const textSize = RendererSDK.GetTextSize(
			this.text,
			RendererSDK.DefaultFontName,
			textFontSize
		)

		Position.AddScalarX(infoSize + textPadding)
		Position.AddScalarY((infoSize - textSize.y - textSize.z) / 2)
		RendererSDK.Text(
			this.text,
			Position,
			opacityWhite,
			RendererSDK.DefaultFontName,
			textFontSize
		)
	}
}
