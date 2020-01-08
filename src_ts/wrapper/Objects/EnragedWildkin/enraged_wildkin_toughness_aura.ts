import Ability from "../Base/Ability"

export default class enraged_wildkin_toughness_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_EnragedWildkin_ToughnessAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enraged_wildkin_toughness_aura", enraged_wildkin_toughness_aura)
