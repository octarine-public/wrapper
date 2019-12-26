//@ts-nocheck
import { Base } from "./Extends/Helper"
import { XMarkPos, XMarkType } from "./Module/Combo"
import { Hero, RendererSDK, LocalPlayer, Game, DOTAGameUIState_t } from "wrapper/Imports"
import { AutoStakerGameEnded, InitDrawStaker } from "./Module/AutoStacker"
import { MouseTarget, Owner, initDrawMap, initItemsMap, initAbilityMap } from "./Listeners"
import {
	DrawingColorAbilityBringer,
	DrawingColorAbilityGhostship,
	DrawingColorAbilityTorrent,
	DrawingColorAbilityXMarks,
	DrawRadiusMouse,
	DrawRadiusMouseColor,
	State,
	DrawTarget,
	Radius,
	BlinkRadiusItemColor,
	AttackRangeRadius,
	RadiusColorAttackRange
} from "./Menu"

let TargetCombo: Hero
export function Draw() {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || Owner === undefined)
		return

	let Particle = initDrawMap.get(Owner),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Items === undefined || Abilities === undefined || Particle === undefined)
		return

	Particle.RenderLineTarget(Base, DrawTarget, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)
	Particle.Render(Abilities.Torrent, "kunkka_torrent", Abilities.Torrent.CastRange, Radius, State, DrawingColorAbilityTorrent.Color)
	Particle.Render(Abilities.Ghostship, "kunkka_ghostship", Abilities.Ghostship.CastRange, Radius, State, DrawingColorAbilityGhostship.Color)
	Particle.Render(Abilities.MarksSpot, "kunkka_x_marks_the_spot", Abilities.MarksSpot.CastRange, Radius, State, DrawingColorAbilityXMarks.Color)
	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.AOERadius, Radius, State, BlinkRadiusItemColor.Color)
	Particle.Render(Abilities.Tidebringer, "kunkka_tidebringer", Abilities.Tidebringer.GetSpecialValue("cleave_distance"), Radius, State, DrawingColorAbilityBringer.Color)
	if (Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	// TODO recode..
	if (!DrawRadiusMouse.value)
		return
	if (!XMarkPos.IsZero()) {
		if (TargetCombo === undefined)
			TargetCombo = MouseTarget

		if (TargetCombo !== undefined) {
			let textAroundMouse = "",
				TargetName = TargetCombo.Name.toString().split("_").splice(3, 3).join(" ")
			switch (XMarkType) {
				case 0:
				case 1:
					textAroundMouse = "Combo: (" + TargetName + ")"
					break
				default:
					textAroundMouse = "Torrent: (" + TargetName + ")"
					break
			}
			RendererSDK.TextAroundMouse(textAroundMouse, false, DrawRadiusMouseColor.Color)
		}
	} else if (XMarkPos.IsZero())
		TargetCombo = undefined
	InitDrawStaker()
}

export function DrawDeleteTempAllVars() {
	AutoStakerGameEnded()
	TargetCombo = undefined
}