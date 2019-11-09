import { RendererSDK, Unit, Vector2 } from "wrapper/Imports";
import ManagerBase from "../../../abstract/Base";
import { Units } from "../Entities";
import {
	DrawEnemyOrAllies,
	DrawTextColorShrine,
	DrawTextColorShrineIsReady,
	DrawTextSize,
	DrawTextSizeShrine,
	ShrineState,
	ShrineStateIcon,
	ShrineStateIconColor,
} from "../Menu";

let Base: ManagerBase = new ManagerBase()

function RenderIcon(position_unit: Vector2, path_icon: string) {
	RendererSDK.Image(
		path_icon,
		position_unit.SubtractScalar(DrawTextSize.value / 4).Clone().AddScalarY(8).AddScalarX(-25),
		new Vector2(42 / 2, 42 / 2), ShrineStateIconColor.Color,
	)
}

function DrawShrineTime(unit: Unit) {
	let abil = unit.GetAbilityByName("filler_ability");
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
}

export function DrawShrine() {
	if (Units.length === 0)
		return false

	if (ShrineState.value) {
		// loop-optimizer: FORWARD, POSSIBLE_UNDEFINED
		Units.filter(x => {
			if (!x.Name.includes("healers"))
				return false

			switch (DrawEnemyOrAllies.selected_id) {
				case 0:
					return Base.IsShrine(x)
				case 1:
					return !x.IsEnemy() && Base.IsShrine(x) //&& CreateRange(x, 500)
				case 2:
					return x.IsEnemy() && Base.IsShrine(x) //&& CreateRange(x, 500)
			}
		}).map(DrawShrineTime)
	}
}