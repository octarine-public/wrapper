
import { Base } from "./Extends/Helper"
import InitDrawBase from "../Base/DrawDotTarget"
import { Owner, MouseTarget } from "./Listeners"
import { DrawingStatus, State } from "./Menu"

export function Draw() {
	let Drawing = new InitDrawBase(Owner, MouseTarget)
	if (!DrawingStatus.value) {
		Drawing.ResetEnemyParticle()
	}
	if (Drawing !== undefined && DrawingStatus.value) {
		Drawing.DrawTarget(Base, State)
	}
}
export function DrawDeleteTempAllVars() {
	new InitDrawBase().ResetEnemyParticle()
}