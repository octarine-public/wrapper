import Ability from "../../Base/Ability"

export default class drow_ranger_frost_arrows extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DrowRanger_FrostArrows
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_frost_arrows", drow_ranger_frost_arrows)
