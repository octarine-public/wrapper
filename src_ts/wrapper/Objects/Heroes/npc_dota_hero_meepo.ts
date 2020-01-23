import Hero from "../Base/Hero"
import meepo_divided_we_stand from "../Abilities/Meepo/meepo_divided_we_stand"

export default class npc_dota_hero_meepo extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Meepo>
	public IsClone = false
	public WhichMeepo = -1

	public get UnitIndex(): number {
		// move it when we_stand will be wrapped as Ability
		let findWeStand = this.GetAbilityByClass(meepo_divided_we_stand)
		if (findWeStand === undefined)
			return -1

		return findWeStand.WhichDividedWeStand
	}
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined && this.IsClone
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Meepo", npc_dota_hero_meepo)
RegisterFieldHandler(npc_dota_hero_meepo, "m_bIsIllusion", (meepo, new_value) => meepo.IsClone = new_value as boolean)
RegisterFieldHandler(npc_dota_hero_meepo, "m_nWhichMeepo", (meepo, new_value) => meepo.WhichMeepo = new_value as number)
