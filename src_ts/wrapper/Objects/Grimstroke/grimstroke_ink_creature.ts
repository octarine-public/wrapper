import Ability from "../Base/Ability"

export default class grimstroke_ink_creature extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Grimstroke_InkCreature
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_ink_creature", grimstroke_ink_creature)
