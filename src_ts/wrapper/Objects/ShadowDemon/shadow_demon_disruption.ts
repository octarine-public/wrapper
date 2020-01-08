import Ability from "../Base/Ability"

export default class shadow_demon_disruption extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Shadow_Demon_Disruption
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_demon_disruption", shadow_demon_disruption)
