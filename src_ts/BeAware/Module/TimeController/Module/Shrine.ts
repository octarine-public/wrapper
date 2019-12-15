import { RendererSDK, Unit, Vector2, FontFlags_t } from "wrapper/Imports"
import { Units } from "../Entities"
import ManagerBase from "../../../abstract/Base"
import {
	DrawEnemyOrAllies,
	DrawTextColorShrine,
	DrawTextColorShrineIsReady,
	DrawTextSize,
	DrawTextSizeShrine,
	ShrineState,
	ShrineStateIcon,
	ShrineStateIconColor,
} from "../Menu"

let Base: ManagerBase = new ManagerBase()

function RenderIcon(position_unit: Vector2, path_icon: string) {
	RendererSDK.Image(
		path_icon,
		position_unit.SubtractScalar(DrawTextSize.value / 4).Clone().AddScalarY(8).AddScalarX(-25),
		new Vector2(42 / 2, 42 / 2), ShrineStateIconColor.Color,
	)
}

function DrawShrineTime(unit: Unit) {
	if (unit.IsEnemy() && !unit.IsVisibleForEnemies) // TODO improve on particle create
		return false
	let abil = unit.GetAbilityByName("filler_ability")
	if (abil === undefined)
		return false
	let Time = Base.TimeSecondToMin(abil.Cooldown),
		position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return false
	if (abil.Cooldown <= 0) {

		if (ShrineStateIcon.value)
			RenderIcon(position_unit, `panorama/images/control_icons/check_png.vtex_c`)

		RendererSDK.Text("Ready", position_unit, DrawTextColorShrineIsReady.Color, "Verdana", DrawTextSizeShrine.value, FontFlags_t.ANTIALIAS)
	} else {

		if (ShrineStateIcon.value)
			RenderIcon(position_unit, `panorama/images/status_icons/ability_cooldown_icon_psd.vtex_c`)

		RendererSDK.Text(Time, position_unit, DrawTextColorShrine.Color, "Verdana", DrawTextSizeShrine.value, FontFlags_t.ANTIALIAS)
	}
	return true
}

function Switching(x: Unit) {
	if (!x.Name.includes("healer"))
		return false
	switch (DrawEnemyOrAllies.selected_id) {
		case 0:
			return Base.IsShrine(x) && DrawShrineTime(x)
		case 1:
			return Base.IsShrine(x) && !x.IsEnemy() && DrawShrineTime(x)
		case 2:
			return Base.IsShrine(x) && x.IsEnemy() && DrawShrineTime(x)
	}
}

export function DrawShrine() {
	if (!ShrineState.value)
		return
	if (Units.length === 0)
		return
	if (Units.some(Switching))
		return
}