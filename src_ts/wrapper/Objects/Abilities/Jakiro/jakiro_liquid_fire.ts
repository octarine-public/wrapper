import Ability from "../../Base/Ability"

export default class jakiro_liquid_fire extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Jakiro_Liquid_Fire>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("jakiro_liquid_fire", jakiro_liquid_fire)
