import Ability from "../Base/Ability"

export default class lion_voodoo extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lion_Voodoo
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_voodoo", lion_voodoo)
