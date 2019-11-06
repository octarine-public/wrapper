import { Color, GameSleeper, Hero, ParticlesSDK, RendererSDK, Vector3 } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { MouseTarget, Owner } from "./Listeners"
import {
	DrawingAbility,
	DrawingColorAbilityBringer,
	DrawingColorAbilityGhostship,
	DrawingColorAbilityTorrent,
	DrawingColorAbilityXMarks,
	DrawingItems,
	DrawRadiusMouse,
	DrawRadiusMouseColor,
	State,
} from "./Menu"
import { AutoStakerGameEnded, InitDrawStaker } from "./Module/AutoStacker"

import InitDrawBase from "../Base/DrawDotTarget"
import InitAbilities from "./Extends/Abilities"
import InitItems from "./Extends/Items"
import { XMarkPos, XMarkType } from "./Module/Combo"

let Ship: number,
	Blink: number,
	Torrent: number,
	XMarks: number,
	Tidebringer: number,
	Sleep = new GameSleeper(),
	TempLevelXMarks = 0,
	TargetCombo: Hero

function ShipRadius() {
	if (Sleep.Sleeping("Ship"))
		return false
	if (!Owner.IsAlive)
		DeleteShip()

	if (Ship === undefined) {
		if (Ship !== undefined)
			ParticlesSDK.Destroy(Ship, true)
		Ship = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}
	let Abilities = new InitAbilities(Owner),
		Ghostship = Abilities.Ghostship
	if (Ghostship !== undefined && Ghostship.Level !== 0) {
		let color = DrawingColorAbilityGhostship.Color
		ParticlesSDK.SetControlPoint(Ship, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Ship, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Ship, 3, new Vector3(Ghostship.CastRange))
		ParticlesSDK.SetControlPoint(Ship, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "Ship")
	} else
		DeleteShip()
}
function DeleteShip() {
	if (Ship === undefined)
		return
	ParticlesSDK.Destroy(Ship, true)
	Ship = undefined
}

function TorrentRadius() {
	if (Sleep.Sleeping("Torrent"))
		return false
	if (!Owner.IsAlive)
		DeleteTorrent()
	if (Torrent === undefined) {
		if (Torrent !== undefined)
			ParticlesSDK.Destroy(Torrent, true)
		Torrent = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}
	let Abilities = new InitAbilities(Owner),
		TorrentAbil = Abilities.Torrent
	if (TorrentAbil !== undefined && TorrentAbil.Level !== 0) {
		let color = DrawingColorAbilityTorrent.Color
		ParticlesSDK.SetControlPoint(Torrent, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Torrent, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Torrent, 3, new Vector3(TorrentAbil.CastRange))
		ParticlesSDK.SetControlPoint(Torrent, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "Torrent")
	} else DeleteTorrent()
}
function DeleteTorrent() {
	if (Torrent !== undefined) {
		ParticlesSDK.Destroy(Torrent, true)
		Torrent = undefined
	}
}

function XMarksRadius() {
	if (Sleep.Sleeping("XMarks"))
		return false
	if (!Owner.IsAlive)
		DeleteXMarks()
	if (XMarks === undefined) {
		if (XMarks !== undefined)
			ParticlesSDK.Destroy(XMarks, true)
		XMarks = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}
	let Abilities = new InitAbilities(Owner),
		XMarksSpot = Abilities.MarksSpot
	if (XMarksSpot !== undefined && XMarksSpot.Level !== 0) {
		if (XMarksSpot !== undefined && TempLevelXMarks !== XMarksSpot.Level) {
			DeleteXMarks()
		}
		TempLevelXMarks = XMarksSpot.Level
		let color = DrawingColorAbilityXMarks.Color
		ParticlesSDK.SetControlPoint(XMarks, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(XMarks, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(XMarks, 3, new Vector3(XMarksSpot.CastRange))
		ParticlesSDK.SetControlPoint(XMarks, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "XMarks")
	} else DeleteXMarks()
}
function DeleteXMarks() {
	if (XMarks !== undefined) {
		ParticlesSDK.Destroy(XMarks, true)
		XMarks = undefined
	}
}

function TidebringerRadius() {
	if (Sleep.Sleeping("Tidebringer")) {
		return false
	}
	if (!Owner.IsAlive) {
		DeleteTidebringer()
	}
	if (Tidebringer === undefined) {
		if (Tidebringer !== undefined)
			ParticlesSDK.Destroy(Tidebringer, true)
		Tidebringer = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}
	let Abilities = new InitAbilities(Owner),
		TidebringerAbil = Abilities.Tidebringer
	if (TidebringerAbil !== undefined && TidebringerAbil.Level !== 0) {
		let color = DrawingColorAbilityBringer.Color
		ParticlesSDK.SetControlPoint(Tidebringer, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Tidebringer, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Tidebringer, 3, new Vector3(1100))
		ParticlesSDK.SetControlPoint(Tidebringer, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "Tidebringer")
	} else DeleteTidebringer()
}
function DeleteTidebringer() {
	if (Tidebringer !== undefined) {
		ParticlesSDK.Destroy(Tidebringer, true)
		Tidebringer = undefined
	}
}

function BlinkRadius() {
	if (Sleep.Sleeping("Blink")) {
		return false
	}
	if (!Owner.IsAlive) {
		DeleteBlink()
		return false
	}
	let Items = new InitItems(Owner)
	if (Blink === undefined) {
		if (Blink !== undefined)
			ParticlesSDK.Destroy(Blink, true)
		Blink = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}

	if (Items.Blink !== undefined) {
		let color = new Color(255, 255, 255)
		ParticlesSDK.SetControlPoint(Blink, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Blink, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Blink, 3, new Vector3(1100))
		ParticlesSDK.SetControlPoint(Blink, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "Blink")
	} else DeleteBlink()
}
function DeleteBlink() {
	if (Blink !== undefined) {
		ParticlesSDK.Destroy(Blink, true)
		Blink = undefined
	}
}

export function Draw() {
	let Drawing = new InitDrawBase(Owner, MouseTarget)
	if (Drawing !== undefined) {
		Drawing.DrawTarget(Base, State)
	}
	DrawingAbility.IsEnabled("kunkka_torrent")
		? TorrentRadius()
		: DeleteTorrent()

	DrawingAbility.IsEnabled("kunkka_tidebringer")
		? TidebringerRadius()
		: DeleteTidebringer()

	DrawingAbility.IsEnabled("kunkka_x_marks_the_spot")
		? XMarksRadius()
		: DeleteXMarks()

	DrawingAbility.IsEnabled("kunkka_ghostship")
		? ShipRadius()
		: DeleteShip()

	DrawingItems.IsEnabled("item_blink")
		? BlinkRadius()
		: DeleteBlink()

	if (DrawRadiusMouse.value) {
		if (!XMarkPos.IsZero()) {
			if (TargetCombo === undefined)
				TargetCombo = MouseTarget

			if (TargetCombo !== undefined) {
				let textAroundMouse = "",
					TargetName = TargetCombo.Name.toString().split("_").splice(3, 3).join(" ")
				switch (XMarkType) {
					case 0:
					case 1:
						textAroundMouse = "Combo: (" + TargetName + ")";
						break;
					default:
						textAroundMouse = "Torrent: (" + TargetName + ")";
						break;
				}
				RendererSDK.TextAroundMouse(textAroundMouse, false, DrawRadiusMouseColor.Color)
			}
		} else if (XMarkPos.IsZero()) {
			TargetCombo = undefined
		}
	}
	InitDrawStaker()
}

export function DrawDeleteTempAllVars() {
	Ship = undefined
	Blink = undefined
	Torrent = undefined
	XMarks = undefined
	Tidebringer = undefined
	TempLevelXMarks = 0
	Sleep.FullReset()
	AutoStakerGameEnded()
	new InitDrawBase().ResetEnemyParticle()
}