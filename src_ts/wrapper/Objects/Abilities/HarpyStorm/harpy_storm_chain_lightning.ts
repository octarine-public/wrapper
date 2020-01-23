import Ability from "../../Base/Ability"

export default class harpy_storm_chain_lightning extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_HarpyStorm_ChainLightning>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("harpy_storm_chain_lightning", harpy_storm_chain_lightning)
