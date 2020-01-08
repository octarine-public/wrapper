import Ability from "../Base/Ability"

export default class dragon_knight_breathe_fire extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DragonKnight_BreatheFire
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dragon_knight_breathe_fire", dragon_knight_breathe_fire)
