import Ability from "../Base/Ability"

export default class skeleton_king_mortal_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SkeletonKing_MortalStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_mortal_strike", skeleton_king_mortal_strike)
