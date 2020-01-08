import Ability from "../Base/Ability"

export default class life_stealer_empty_2 extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Life_Stealer_Empty2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_empty_2", life_stealer_empty_2)
