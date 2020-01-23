import Ability from "../../Base/Ability"

export default class lycan_feral_impulse extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lycan_FeralImpulse>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_feral_impulse", lycan_feral_impulse)
