import Ability from "../Base/Ability"

export default class frostivus2018_decorate_tree extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Frostivus2018_Decorate_Tree
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("frostivus2018_decorate_tree", frostivus2018_decorate_tree)
