import Ability from "../../Base/Ability"

export default class earth_spirit_boulder_smash extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_EarthSpirit_BoulderSmash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_boulder_smash", earth_spirit_boulder_smash)
