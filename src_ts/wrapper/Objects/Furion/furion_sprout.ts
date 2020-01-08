import Ability from "../Base/Ability"

export default class furion_sprout extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Furion_Sprout
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("furion_sprout", furion_sprout)
