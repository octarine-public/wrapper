import Ability from "../../Base/Ability"

export default class keeper_of_the_light_chakra_magic extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_KeeperOfTheLight_ChakraMagic>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_chakra_magic", keeper_of_the_light_chakra_magic)
