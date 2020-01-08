import Ability from "../Base/Ability"

export default class shadow_demon_soul_catcher extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Shadow_Demon_Soul_Catcher
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_demon_soul_catcher", shadow_demon_soul_catcher)
