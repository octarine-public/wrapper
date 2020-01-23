import Ability from "../../Base/Ability"

export default class clinkz_burning_army extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Clinkz_Burning_Army
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_burning_army", clinkz_burning_army)
