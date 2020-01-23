import Ability from "../../Base/Ability"

export default class earth_spirit_stone_caller extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_EarthSpirit_StoneCaller
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_stone_caller", earth_spirit_stone_caller)
