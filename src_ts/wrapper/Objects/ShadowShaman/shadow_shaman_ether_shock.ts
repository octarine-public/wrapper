import Ability from "../Base/Ability"

export default class shadow_shaman_ether_shock extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ShadowShaman_EtherShock
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_shaman_ether_shock", shadow_shaman_ether_shock)
