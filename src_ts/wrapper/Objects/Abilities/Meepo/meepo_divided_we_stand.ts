import Ability from "../../Base/Ability"
import EntityManager from "../../../Managers/EntityManager"
import { WrapperClass, NetworkedBasicField } from "../../../Decorators"

@WrapperClass("meepo_divided_we_stand")
export default class meepo_divided_we_stand extends Ability {
	@NetworkedBasicField("m_nWhichDividedWeStand")
	public WhichDividedWeStand = -1
	@NetworkedBasicField("m_nNumDividedWeStand")
	public NumDividedWeStand = -1
	@NetworkedBasicField("m_entPrimeDividedWeStand")
	public PrimeDividedWeStand_ = 0
	@NetworkedBasicField("m_entNextDividedWeStand")
	public NextDividedWeStand_ = 0

	public get PrimeDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.PrimeDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
	public get NextDividedWeStand(): Nullable<meepo_divided_we_stand> {
		return EntityManager.EntityByIndex(this.NextDividedWeStand_) as Nullable<meepo_divided_we_stand>
	}
}
