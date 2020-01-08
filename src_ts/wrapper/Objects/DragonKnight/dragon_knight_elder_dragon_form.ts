import Ability from "../Base/Ability"

export default class dragon_knight_elder_dragon_form extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DragonKnight_ElderDragonForm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dragon_knight_elder_dragon_form", dragon_knight_elder_dragon_form)
