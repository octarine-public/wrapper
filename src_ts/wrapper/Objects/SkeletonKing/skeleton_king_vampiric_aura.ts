import Ability from "../Base/Ability"

export default class skeleton_king_vampiric_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SkeletonKing_VampiricAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_vampiric_aura", skeleton_king_vampiric_aura)
