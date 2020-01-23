import Ability from "../../Base/Ability"

export default class rattletrap_hookshot extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rattletrap_Hookshot>

	public get AOERadius(): number {
		return this.GetSpecialValue("latch_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_hookshot", rattletrap_hookshot)
