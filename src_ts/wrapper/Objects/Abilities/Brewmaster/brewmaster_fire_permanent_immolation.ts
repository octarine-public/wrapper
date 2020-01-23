import Ability from "../../Base/Ability"

export default class brewmaster_fire_permanent_immolation extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_PermanentImmolation
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_fire_permanent_immolation", brewmaster_fire_permanent_immolation)
