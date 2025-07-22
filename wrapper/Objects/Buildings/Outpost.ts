import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_Watch_Tower")
export class Outpost extends Building {
	/**
	 * @readonly
	 * @description Represents the name of the outpost.
	 */
	@NetworkedBasicField("m_szOutpostName")
	public OutpostName = ""

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsOutpost = true
	}

	public get RingRadius(): number {
		return 150
	}

	public IsVisibleForEnemies(_seconds: number): boolean {
		return false
	}
}
