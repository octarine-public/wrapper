import Ability from "../Base/Ability"

export default class ember_spirit_fire_remnant extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_EmberSpirit_FireRemnant
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ember_spirit_fire_remnant", ember_spirit_fire_remnant)
