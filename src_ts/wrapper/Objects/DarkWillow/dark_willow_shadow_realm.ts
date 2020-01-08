import Ability from "../Base/Ability"

export default class dark_willow_shadow_realm extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkWillow_ShadowRealm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_willow_shadow_realm", dark_willow_shadow_realm)
