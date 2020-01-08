import Hero from "../Base/Hero"
import meepo_divided_we_stand from "./meepo_divided_we_stand"

export default class npc_dota_hero_meepo extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Meepo

	public get UnitIndex(): number {
		// move it when we_stand will be wrapped as Ability
		let findWeStand = this.Spells.find(abil => abil instanceof meepo_divided_we_stand) as Nullable<meepo_divided_we_stand>
		if (findWeStand === undefined)
			return -1

		return findWeStand.m_pBaseEntity.m_nWhichDividedWeStand
	}
	public get WhichMeepo(): number {
		return this.m_pBaseEntity.m_nWhichMeepo
	}
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined && this.m_pBaseEntity.m_bIsIllusion
	}
	public get IsClone(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Meepo", npc_dota_hero_meepo)
