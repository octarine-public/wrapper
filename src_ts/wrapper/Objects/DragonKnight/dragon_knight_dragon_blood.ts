import Ability from "../Base/Ability"

export default class dragon_knight_dragon_blood extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DragonKnight_DragonBlood
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dragon_knight_dragon_blood", dragon_knight_dragon_blood)
