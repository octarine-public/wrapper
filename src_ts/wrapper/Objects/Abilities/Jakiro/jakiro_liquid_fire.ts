import Ability from "../../Base/Ability"

export default class jakiro_liquid_fire extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Jakiro_Liquid_Fire

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("jakiro_liquid_fire", jakiro_liquid_fire)
