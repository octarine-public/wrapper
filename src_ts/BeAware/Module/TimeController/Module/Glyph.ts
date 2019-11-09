
import { Game, LocalPlayer, RendererSDK, Team, Unit, Vector2 } from "wrapper/Imports"
import ManagerBase from "../../../abstract/Base"
import { Units } from "../Entities"
import {
	DrawTextColor,
	DrawTextSize,
	DrawTimerGlyphSize,
	DrawTimerGlyphState,
	DrawTimerGlyphX,
	DrawTimerGlyphY,
	GlyphInRange,
	GlyphState,
	GlyphStateIcon,
	GlyphStateIconColor,
	GlyphSwitcher,
	GlyphSwitcherTeam,
} from "../Menu"

let Base = new ManagerBase()

function RenderIcon(position_unit: Vector2, path_icon: string, ShrineStateIconColor: any) {
	RendererSDK.Image(
		path_icon,
		position_unit.SubtractScalar(DrawTextSize.value / 4).Clone().AddScalarY(8).AddScalarX(-25),
		new Vector2(42 / 2, 42 / 2), ShrineStateIconColor.Color,
	)
}

function SelectedGlyph(unit: Unit) {
	let buff = unit.GetBuffByName("modifier_fountain_glyph")
	if (buff === undefined)
		return
	let time = buff.RemainingTime
	if (!unit.IsInRange(LocalPlayer.Hero, GlyphInRange.value) || time <= 0)
		return
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return

	let pos_unit_text = unit.Name.includes("healers")
		? position_unit.Clone().AddScalarY(25)
		: position_unit
	if (GlyphStateIcon.value)
		RenderIcon(pos_unit_text, "panorama/images/hud/icon_glyph_small_psd.vtex_c", GlyphStateIconColor)
	RendererSDK.Text(
		time.toFixed(1),
		pos_unit_text,
		DrawTextColor.Color,
		"Verdana",
		DrawTextSize.value,
		FontFlags_t.ANTIALIAS,
	)
}

function SelectedBuilding(x: Unit) {
	switch (GlyphSwitcherTeam.selected_id) {
		case 0: return SelectedGlyph(x)
		case 1: return !x.IsEnemy() && SelectedGlyph(x)
		case 2: return x.IsEnemy() && SelectedGlyph(x)
	}
}

export function DrawGlyph() {
	if (GlyphState.value) {
		// ============================== Glyph ============================ //
		// loop-optimizer: FORWARD, POSSIBLE_UNDEFINED
		Units.filter(x => x.IsAlive).forEach(x => {
			switch (GlyphSwitcher.selected_id) {
				case 0: return SelectedBuilding(x)
				case 1: return x.IsLaneCreep && SelectedBuilding(x)
				case 2: return x.IsBuilding && SelectedBuilding(x)
			}
		})
		if (DrawTimerGlyphState.value && LocalPlayer !== undefined)
			Base.DrawTimer(
				LocalPlayer.Team !== Team.Radiant
					? Game.GlyphCooldownRediant
					: Game.GlyphCooldownDire,
				DrawTimerGlyphX,
				DrawTimerGlyphY,
				DrawTimerGlyphSize,
			)
	}
}