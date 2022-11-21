import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { WardObserver } from "./WardObserver"

@WrapperClass("CDOTA_NPC_Observer_Ward_TrueSight")
export class WardTrueSight extends WardObserver {
	public CalculateActivityModifiers(
		activity: GameActivity,
		ar: string[]
	): void {
		super.CalculateActivityModifiers(activity, ar)
		ar.push("sentry")
	}
}
