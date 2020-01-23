import Ability from "../../Base/Ability"

export default class enchantress_bunny_hop extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enchantress_Bunny_Hop>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enchantress_bunny_hop", enchantress_bunny_hop)
