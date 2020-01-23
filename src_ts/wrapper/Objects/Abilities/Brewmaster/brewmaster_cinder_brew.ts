import Ability from "../../Base/Ability"

export default class brewmaster_cinder_brew extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_CinderBrew
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_cinder_brew", brewmaster_cinder_brew)
