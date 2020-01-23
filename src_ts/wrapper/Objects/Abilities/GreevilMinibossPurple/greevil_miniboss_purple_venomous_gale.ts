import Ability from "../../Base/Ability"

export default class greevil_miniboss_purple_venomous_gale extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_Purple_VenomousGale>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_purple_venomous_gale", greevil_miniboss_purple_venomous_gale)
