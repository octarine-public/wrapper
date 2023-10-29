import { WrapperClass } from "../../Decorators"
import { Building } from "./Building"

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
}
