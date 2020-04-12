import { State } from "./Menu"
import { DrawGlyph } from "./Module/Glyph"
import { DrawRoshan } from "./Module/Roshan"
import { DrawRunes } from "./Module/Runes"
export function Draw() {
	if (!State.value)
		return
	DrawGlyph()
	DrawRunes()
	DrawRoshan()
}
