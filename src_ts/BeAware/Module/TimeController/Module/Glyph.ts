
import { LocalPlayer, RendererSDK, Unit, Vector2, FontFlags_t, Hero, Creep, Building } from "wrapper/Imports"

import {
	DrawTextColor,
	DrawTextSize,
	GlyphInRange,
	GlyphState,
	GlyphStateIcon,
	GlyphStateIconColor,
	GlyphSwitcher,
	GlyphSwitcherTeam,
} from "../Menu"
import { Units } from "../Entities"

function RenderIcon(position_unit: Vector2, path_icon: string, ShrineStateIconColor: any) {
	RendererSDK.Image(
		path_icon,
		position_unit.SubtractScalar(DrawTextSize.value / 4).Clone().AddScalarY(8).AddScalarX(-25),
		new Vector2(42 / 2, 42 / 2), ShrineStateIconColor.Color,
	)
}

function SelectedGlyph(unit: Unit) {
	if (LocalPlayer === undefined || LocalPlayer.Hero === undefined)
		return
	let time = unit.GetBuffByName("modifier_fountain_glyph")?.RemainingTime
	if (!unit.IsInRange(LocalPlayer.Hero, GlyphInRange.value) || time === undefined || time <= 0)
		return
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return
	let pos_unit_text = unit.Name.includes("healer")
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
		Units.forEach(x => {
			if (x instanceof Hero)
				return
			switch (GlyphSwitcher.selected_id) {
				case 0: return SelectedBuilding(x)
				case 1: return x instanceof Creep && x.IsLaneCreep && SelectedBuilding(x)
				case 2: return x instanceof Building && SelectedBuilding(x)
			}
		})
	}
}
