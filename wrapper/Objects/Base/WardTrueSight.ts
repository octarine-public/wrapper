import { WrapperClass } from "../../Decorators"
import { GameActivity_t } from "../../Enums/GameActivity_t"
import { WardObserver } from "./WardObserver"

@WrapperClass("CDOTA_NPC_Observer_Ward_TrueSight")
export class WardTrueSight extends WardObserver {
	public CalculateActivityModifiers(activity: GameActivity_t, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		ar.push("sentry")
	}
}
