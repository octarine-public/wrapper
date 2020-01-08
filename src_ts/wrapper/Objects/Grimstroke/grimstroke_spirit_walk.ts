import Ability from "../Base/Ability"

export default class grimstroke_spirit_walk extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Grimstroke_SpiritWalk

	public get AOERadius(): number {
		return this.GetSpecialValue("radius") + (this.Owner?.GetTalentValue("special_bonus_unique_grimstroke_1") ?? 0)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_spirit_walk", grimstroke_spirit_walk)
