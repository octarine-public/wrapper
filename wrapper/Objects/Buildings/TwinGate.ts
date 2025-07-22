import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_Unit_Twin_Gate")
export class TwinGate extends Building {
	public IsVisibleForEnemies(_seconds: number): boolean {
		return false
	}
}
