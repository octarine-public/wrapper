import Ability from "../Base/Ability"

export default class omniknight_guardian_angel extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Omniknight_GuardianAngel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("omniknight_guardian_angel", omniknight_guardian_angel)
