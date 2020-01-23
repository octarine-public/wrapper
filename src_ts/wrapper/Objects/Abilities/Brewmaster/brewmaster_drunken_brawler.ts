import Ability from "../../Base/Ability"

export default class brewmaster_drunken_brawler extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_DrunkenBrawler
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_drunken_brawler", brewmaster_drunken_brawler)
