import Ability from "../../Base/Ability"
import EntityManager from "../../../Managers/EntityManager"

export default class meepo_divided_we_stand extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Meepo_DividedWeStand>
	public WhichDividedWeStand = -1
	public NumDividedWeStand = -1
	public PrimeDividedWeStand_ = 0
	public NextDividedWeStand_ = 0

	public get PrimeDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.PrimeDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
	public get NextDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.NextDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_divided_we_stand", meepo_divided_we_stand)
RegisterFieldHandler(meepo_divided_we_stand, "m_nWhichDividedWeStand", (abil, new_value) => abil.WhichDividedWeStand = new_value as number)
RegisterFieldHandler(meepo_divided_we_stand, "m_nNumDividedWeStand", (abil, new_value) => abil.NumDividedWeStand = new_value as number)
RegisterFieldHandler(meepo_divided_we_stand, "m_entPrimeDividedWeStand", (abil, new_value) => abil.PrimeDividedWeStand_ = new_value as number)
RegisterFieldHandler(meepo_divided_we_stand, "m_entNextDividedWeStand", (abil, new_value) => abil.NextDividedWeStand_ = new_value as number)
