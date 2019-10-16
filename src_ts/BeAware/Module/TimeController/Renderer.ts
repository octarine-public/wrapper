import { State } from "./Menu";
import { DrawScan } from "./Module/Scan";
import { DrawRunes } from "./Module/Runes";
import { DrawGlyph } from "./Module/Glyph";
import { DrawShrine } from "./Module/Shrine";
import { DrawRoshan } from "./Module/Roshan";

export function Draw() {
	if (State.value) {
		DrawScan()
		DrawGlyph()
		DrawRunes()
		DrawShrine()
		DrawRoshan()
	}
}

