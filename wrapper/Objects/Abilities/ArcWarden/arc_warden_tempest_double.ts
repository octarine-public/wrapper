import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"

@WrapperClass("arc_warden_tempest_double")
export class arc_warden_tempest_double extends Ability {
	@NetworkedBasicField("m_hDoubles")
	private readonly tempestDoubles_ = -1

	public get TempestDoubles() {
		return EntityManager.EntityByIndex<Hero>(this.tempestDoubles_)
	}
}
