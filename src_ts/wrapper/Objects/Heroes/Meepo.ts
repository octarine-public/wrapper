import Hero from "../Base/Hero"

export default class Meepo extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Meepo

	public get UnitIndex(): number {
		// move it when we_stand will be wrapped as Ability
		let findWeStand = this.Spells.find(abil => abil && abil.Name === "meepo_divided_we_stand")

		if (findWeStand === undefined)
			return -1

		return (findWeStand.m_pBaseEntity as C_DOTA_Ability_Meepo_DividedWeStand).m_nWhichDividedWeStand
	}
	public get WhichMeepo(): number {
		return this.m_pBaseEntity.m_nWhichMeepo
	}
	public get IsIllusion(): boolean {
		return this.ReplicateFrom !== undefined && this.m_pBaseEntity.m_bIsIllusion
	}
	public get IsClone(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Meepo", Meepo)
