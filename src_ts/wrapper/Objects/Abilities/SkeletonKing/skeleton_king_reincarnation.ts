import Ability from "../../Base/Ability"

export default class skeleton_king_reincarnation extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SkeletonKing_Reincarnation>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_reincarnation", skeleton_king_reincarnation)
