import Ability from "../Base/Ability"

export default class beastmaster_boar_poison extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_CallOfTheWild_Boar_Poison
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_boar_poison", beastmaster_boar_poison)
