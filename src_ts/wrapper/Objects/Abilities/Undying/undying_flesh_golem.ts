import Ability from "../../Base/Ability"

export default class undying_flesh_golem extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Undying_FleshGolem

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_flesh_golem", undying_flesh_golem)
