import { WrapperClass } from "../../Decorators"
import { meepo_divided_we_stand } from "../Abilities/Meepo/meepo_divided_we_stand"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Meepo")
export class npc_dota_hero_meepo extends Hero {
	public get WhichMeepo(): number {
		// move it when we_stand will be wrapped as Ability
		const findWeStand = this.GetAbilityByClass(meepo_divided_we_stand)
		if (findWeStand === undefined) {
			return 0
		}

		return findWeStand.WhichDividedWeStand
	}
	public get IsClone(): boolean {
		return this.WhichMeepo !== 0
	}
	public get IsIllusion(): boolean {
		return super.IsIllusion && !this.IsClone
	}
	public get CanBeMainHero(): boolean {
		return super.CanBeMainHero && !this.IsClone
	}
}
