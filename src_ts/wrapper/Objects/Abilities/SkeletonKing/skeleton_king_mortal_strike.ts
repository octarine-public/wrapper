import Ability from "../../Base/Ability"

export default class skeleton_king_mortal_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SkeletonKing_MortalStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_mortal_strike", skeleton_king_mortal_strike)
