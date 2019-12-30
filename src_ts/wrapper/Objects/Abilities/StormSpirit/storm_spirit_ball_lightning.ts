import Ability from "../../Base/Ability"

export default class storm_spirit_ball_lightning extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_StormSpirit_BallLightning

	public get CastRange(): number {
		let mana = this.Owner?.Mana! - this.ManaCost
		if (mana <= 0)
			return 0

		let travelCost = this.GetSpecialValue("ball_lightning_travel_cost_base")
			+ (this.Owner?.MaxMana! * (this.GetSpecialValue("ball_lightning_travel_cost_percent") / 100))

		return travelCost !== 0 ? Math.ceil(mana / travelCost) * 100 : 0

	}

	public get AOERadius(): number {
		return this.GetSpecialValue("ball_lightning_aoe")
	}

	public get Speed(): number {
		return this.GetSpecialValue("ball_lightning_move_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("storm_spirit_ball_lightning", storm_spirit_ball_lightning)
