import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_NPC_Lantern")
export class Lantern extends Building {
	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsWatcher = true
	}
}
