import Ability from "../Base/Ability"

export default class medusa_split_shot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Medusa_SplitShot
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("medusa_split_shot", medusa_split_shot)
