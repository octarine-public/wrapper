import Ability from "../../Base/Ability"

export default class phantom_lancer_phantom_edge extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_PhantomLancer_PhantomEdge>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_lancer_phantom_edge", phantom_lancer_phantom_edge)
