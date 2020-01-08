import Ability from "../Base/Ability"

export default class lycan_feral_impulse extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lycan_FeralImpulse
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_feral_impulse", lycan_feral_impulse)
