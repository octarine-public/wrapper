import Ability from "../Base/Ability"

export default class terrorblade_reflection extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Terrorblade_Reflection

	public get AOERadius(): number {
		return this.GetSpecialValue("range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("terrorblade_reflection", terrorblade_reflection)
