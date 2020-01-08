import Ability from "../Base/Ability"

export default class beastmaster_hawk_invisibility extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_CallOfTheWild_Hawk_Invisibility
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_hawk_invisibility", beastmaster_hawk_invisibility)
