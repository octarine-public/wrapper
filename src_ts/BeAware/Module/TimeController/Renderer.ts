import { State } from "./Menu";
import { DrawGlyph } from "./Module/Glyph";
import { DrawRoshan } from "./Module/Roshan";
import { DrawRunes } from "./Module/Runes";
import { DrawScan } from "./Module/Scan";
import { DrawShrine } from "./Module/Shrine";

export function Draw() {
	if (State.value) {
		DrawScan()
		DrawGlyph()
		DrawRunes()
		DrawShrine()
		DrawRoshan()
	}
}
