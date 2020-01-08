import Ability from "../Base/Ability"

export default class huskar_inner_vitality extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Huskar_Inner_Vitality
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_inner_vitality", huskar_inner_vitality)
