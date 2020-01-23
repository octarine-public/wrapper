import Ability from "../../Base/Ability"

export default class earth_spirit_geomagnetic_grip extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_EarthSpirit_GeomagneticGrip
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_geomagnetic_grip", earth_spirit_geomagnetic_grip)
