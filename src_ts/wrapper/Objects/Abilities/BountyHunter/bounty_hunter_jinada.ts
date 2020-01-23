import Ability from "../../Base/Ability"

export default class bounty_hunter_jinada extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BountyHunter_Jinada>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bounty_hunter_jinada", bounty_hunter_jinada)
