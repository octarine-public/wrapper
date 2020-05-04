import { Color, Menu, RendererSDK, Vector2, FontFlags_t } from "wrapper/Imports"

export default class ManagerBase {
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public strZero(sec: number) {
		return sec < 10 ? "0" + sec : sec
	}
	public TimeSecondToMin(sec: number) {
		return Math.floor(sec / 60) + ":" + this.strZero(Math.floor(sec) % 60)
	}
	public GetTime(time: number) {
		return this.TimeSecondToMin(time) + ", " + this.TimeSecondToMin(time + 180)
	}
	public ucFirst(str: string): string {
		if (!str) return str
		return str[0].toUpperCase() + str.slice(1)
	}
	public DrawTimer(Time: number, sliderX: Menu.Slider, sliderY: Menu.Slider, Size: Menu.Slider) {
		if (Time === undefined)
			return false
		let wSize = RendererSDK.WindowSize,
			name = this.TimeSecondToMin(Time),
			pos = new Vector2(
				wSize.x / 100 * sliderX.value,
				wSize.y / 100 * sliderY.value,
			)
		name = Time <= 0 ? "Ready" : name
		RendererSDK.Text(
			name,
			pos,
			new Color(255, 255, 255, 255),
			"Verdana",
			Size.value,
			false,
			FontFlags_t.ANTIALIAS,
		)
	}
}
