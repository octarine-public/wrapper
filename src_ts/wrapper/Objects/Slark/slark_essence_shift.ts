import Ability from "../Base/Ability"

export default class slark_essence_shift extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Slark_EssenceShift
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slark_essence_shift", slark_essence_shift)
