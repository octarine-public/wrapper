import Ability from "../Base/Ability"

export default class lich_frost_aura extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Lich_FrostAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lich_frost_aura", lich_frost_aura)
