import Ability from "../Base/Ability"

export default class arc_warden_spark_wraith extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ArcWarden_SparkWraith
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("arc_warden_spark_wraith", arc_warden_spark_wraith)
