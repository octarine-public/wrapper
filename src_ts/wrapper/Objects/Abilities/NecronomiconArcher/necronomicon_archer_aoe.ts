import Ability from "../../Base/Ability"

export default class necronomicon_archer_aoe extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Necronomicon_Archer_AoE>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necronomicon_archer_aoe", necronomicon_archer_aoe)
