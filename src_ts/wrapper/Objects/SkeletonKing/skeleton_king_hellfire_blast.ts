import Ability from "../Base/Ability"

export default class skeleton_king_hellfire_blast extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SkeletonKing_HellfireBlast
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_hellfire_blast", skeleton_king_hellfire_blast)
