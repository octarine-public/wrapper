import { WrapperClass } from "../../Decorators"
import { Player } from "../Base/Player"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_BaseNPC_Clinkz_Skeleton_Army")
export class npc_dota_clinkz_skeleton_archer extends Unit {
	public GetAttackRangeModifier(baseSpeed: number = this.BaseAttackRange): number {
		let owner = this.Owner
		// sometimes it's a hero or a player
		if (owner instanceof Player) {
			owner = owner.Hero
		}
		return !(owner instanceof Unit)
			? super.GetAttackRangeModifier(baseSpeed)
			: // + 100 wihout special data (maybe it's hardcoded)
				owner.GetAttackRangeModifier(baseSpeed) + 100
	}
}
