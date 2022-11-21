import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_NPC_Observer_Ward")
export class WardObserver extends Unit {
	public get RingRadius(): number {
		return 64
	}
	public CalculateActivityModifiers(
		activity: GameActivity,
		ar: string[]
	): void {
		super.CalculateActivityModifiers(activity, ar)
		ar.push("observer")
	}
}
