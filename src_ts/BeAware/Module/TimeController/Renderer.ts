import { State } from "./Menu"
import { DrawGlyph } from "./Module/Glyph"
import { DrawRoshan } from "./Module/Roshan"
import { DrawRunes } from "./Module/Runes"
import { DrawScan } from "./Module/Scan"
export function Draw() {
	if (!State.value)
		return
	DrawScan()
	DrawGlyph()
	DrawRunes()
	DrawRoshan()
}
