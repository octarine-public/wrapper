import Ability from "../Base/Ability"

export default class broodmother_spawn_spiderlings extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Broodmother_SpawnSpiderlings
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_spawn_spiderlings", broodmother_spawn_spiderlings)
