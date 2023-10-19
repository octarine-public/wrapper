import { WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_VengefulSpirit")
export class npc_dota_hero_vengefulspirit extends Hero {
	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.CanUseItems = false
	}
}
