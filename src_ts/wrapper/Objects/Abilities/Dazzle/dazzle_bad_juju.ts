import Ability from "../../Base/Ability"

export default class dazzle_bad_juju extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Dazzle_Bad_Juju

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_bad_juju", dazzle_bad_juju)
