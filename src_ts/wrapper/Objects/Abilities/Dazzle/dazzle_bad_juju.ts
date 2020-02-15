import Ability from "../../Base/Ability"

export default class dazzle_bad_juju extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Dazzle_Bad_Juju
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_bad_juju", dazzle_bad_juju)
