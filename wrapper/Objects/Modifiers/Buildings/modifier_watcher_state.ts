import { WrapperClassModifier } from "../../../Decorators"
import { Team } from "../../../Enums/Team"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_watcher_state extends Modifier {
	public get IsEnabled(): boolean {
		return this.NetworkArmor === 1
	}
	public get Captured(): boolean {
		return this.NetworkArmor !== 0
	}
	public get CapturedByTeam(): Team {
		return this.NetworkAttackSpeed
	}
	// TODO: captured time, remaining time
}
