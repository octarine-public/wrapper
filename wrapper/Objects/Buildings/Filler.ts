import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_Filler")
export class Filler extends Building {
	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsFiller = true
	}
}
