import Ability from "../Base/Ability"

export default class grimstroke_scepter extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Grimstroke_Scepter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_scepter", grimstroke_scepter)
