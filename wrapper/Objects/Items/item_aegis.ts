import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GameState } from "../../Utils/GameState"
import { Item } from "../Base/Item"

@WrapperClass("item_aegis")
export class item_aegis extends Item {
	@NetworkedBasicField("m_flReclaimTime")
	public ReclaimTime = 0

	public get Cooldown(): number {
		return Math.max(this.ReclaimTime - GameState.RawGameTime, 0)
	}

	public get Duration() {
		return this.ReclaimTime / 60
	}

	public get MaxDuration() {
		return this.Duration
	}

	public get ReincarnateTime() {
		return this.GetSpecialValue("reincarnate_time")
	}
}
