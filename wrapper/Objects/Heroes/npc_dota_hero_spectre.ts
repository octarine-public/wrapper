import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Spectre")
export class npc_dota_hero_spectre extends Hero {
	public CalculateActivityModifiers(
		activity: GameActivity,
		ar: string[]
	): void {
		super.CalculateActivityModifiers(activity, ar)
		// TODO: probably arcana-related daggers_5, daggers_4 and daggers_3
	}
}
