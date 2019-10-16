import { Vector3, Menu, RendererSDK, Vector2, Color, Unit } from "../../wrapper/Imports";

export default class ManagerBase {
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get RoshanPosition(): Vector3 {
		return new Vector3(-2407.3125, 1856.90625, 159.96875)
	}
	public IsShrine(x: Unit): boolean {
		return x.Name !== "dota_fountain" && !x.IsShop && x.IsAlive && x.IsBuilding && !x.IsTower && !x.IsFort && !x.IsShrine && !x.IsBarrack
	}
	public strZero(sec: number) {
		return sec < 10 ? '0' + sec : sec;
	}
	public TimeSecondToMin(sec: number) {
		return Math.floor(sec / 60) + ':' + this.strZero(Math.floor(sec) % 60);
	}
	public GetTime(time: number) {
		return this.TimeSecondToMin(time) + ", " + this.TimeSecondToMin(time + 180);
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
			FontFlags_t.ANTIALIAS,
		)
	}
}