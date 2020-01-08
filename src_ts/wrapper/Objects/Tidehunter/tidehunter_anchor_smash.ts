import Ability from "../Base/Ability"

export default class tidehunter_anchor_smash extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tidehunter_AnchorSmash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tidehunter_anchor_smash", tidehunter_anchor_smash)
