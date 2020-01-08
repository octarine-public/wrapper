import Ability from "../Base/Ability"

export default class dragon_knight_dragon_tail extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DragonKnight_DragonTail
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dragon_knight_dragon_tail", dragon_knight_dragon_tail)
