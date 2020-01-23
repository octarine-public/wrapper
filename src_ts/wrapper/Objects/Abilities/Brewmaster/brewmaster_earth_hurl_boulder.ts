import Ability from "../../Base/Ability"

export default class brewmaster_earth_hurl_boulder extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_HurlBoulder
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_earth_hurl_boulder", brewmaster_earth_hurl_boulder)
