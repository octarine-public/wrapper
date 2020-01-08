import Ability from "../Base/Ability"

export default class rattletrap_overclocking extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rattletrap_Overclocking
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_overclocking", rattletrap_overclocking)
