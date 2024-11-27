import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Spectre")
export class npc_dota_hero_spectre extends Hero {
	public CalculateActivityModifiers(activity: GameActivity, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		if (this.MyWearables.some(wearable => wearable.ItemDefinitionIndex === 9662)) {
			if (this.Level >= 22) { ar.push("daggers_5") }
			} else if (this.Level >= 15) {
				ar.push("daggers_4")
			} else if (this.Level >= 8) {
				ar.push("daggers_3")
			}
		}
	}
}
