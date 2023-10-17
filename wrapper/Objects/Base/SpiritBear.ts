import { WrapperClass } from "../../Decorators"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_Unit_SpiritBear")
export class SpiritBear extends Unit {
	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsSpiritBear = true
	}
}
