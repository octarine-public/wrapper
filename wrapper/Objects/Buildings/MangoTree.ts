import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_MangoTree")
export class MangoTree extends Building {
	public IsVisibleForEnemies(_seconds: number): boolean {
		return false
	}
}
