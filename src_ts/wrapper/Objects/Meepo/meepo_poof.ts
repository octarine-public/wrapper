import Ability from "../Base/Ability"

export default class meepo_poof extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Meepo_Poof
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_poof", meepo_poof)
