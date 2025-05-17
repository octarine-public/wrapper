import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_Barracks")
export class Barrack extends Building {
	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsBarrack = true
	}
	public get RingRadius(): number {
		return 140
	}
	public get IsRanged(): boolean {
		return (
			this.Name === "bad_rax_range_top" ||
			this.Name === "bad_rax_range_mid" ||
			this.Name === "bad_rax_range_bot"
		)
	}
	public get HealthBarSize(): Vector2 {
		return new Vector2(ScaleHeight(179), ScaleHeight(5))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(63))
	}
}
