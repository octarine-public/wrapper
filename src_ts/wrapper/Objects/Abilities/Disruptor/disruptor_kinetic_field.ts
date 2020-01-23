import Ability from "../../Base/Ability"

export default class disruptor_kinetic_field extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Disruptor_KineticField
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("disruptor_kinetic_field", disruptor_kinetic_field)
