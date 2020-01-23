import Ability from "../../Base/Ability"

export default class lich_chain_frost extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lich_ChainFrost>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lich_chain_frost", lich_chain_frost)
