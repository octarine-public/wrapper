import { WrapperClass } from "../../Decorators"
import { GameActivity_t } from "../../Enums/GameActivity_t"
import Unit from "./Unit"

@WrapperClass("CDOTA_NPC_Observer_Ward")
export default class WardObserver extends Unit {
	public get RingRadius(): number {
		return 64
	}
	public CalculateActivityModifiers(activity: GameActivity_t, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		ar.push("observer")
	}
}
