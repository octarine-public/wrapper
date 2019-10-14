import { Vector3 } from "../../wrapper/Imports";

export default class ManagerBase {
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get RoshanPosition(): Vector3 {
		return new Vector3(-2407.3125, 1856.90625, 159.96875)
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
}