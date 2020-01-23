import Ability from "../../Base/Ability"

export default class brewmaster_primal_split extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_PrimalSplit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_primal_split", brewmaster_primal_split)
