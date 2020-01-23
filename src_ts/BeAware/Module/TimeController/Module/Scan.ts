
import { ArrayExtensions, Entity, GameRules, LocalPlayer, ParticlesSDK, RendererSDK, Team, Unit, Vector2, Vector3, FontFlags_t, EventsSDK, GameState } from "wrapper/Imports"
import {
	DrawTimerRadarSize,
	DrawTimerRadarX,
	DrawTimerRadarY,
	RadarState,
	RadarStateInWorld,
	RadarStateInWorldIconSize,
	RadarStateInWorldMiniMapColor,
	RadarStateInWorldSound,
	RadarStateInWorldTextColor,
	RadarStateInWorldTextSize,
	RadarTreeSettingsState,
} from "../Menu"

import ManagerBase from "../../../abstract/Base"
import { OtherRadius } from "../Entities"
let Base = new ManagerBase(),
	checkTick = 0,
	RadarDetect: Entity[] = []

function CreateAbilityRadius(ent: Entity, radius: number) {
	var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	ParticlesSDK.SetControlPoint(par, 1, new Vector3(radius, 0, 0))
	OtherRadius.set(ent, par)
}

export function DrawScan() {
	if (!RadarState.value)
		return
	if (RadarTreeSettingsState.value && LocalPlayer !== undefined)
		Base.DrawTimer(
			LocalPlayer.Team !== Team.Radiant
				? (GameRules?.ScanCooldownRadiant ?? 0)
				: (GameRules?.ScanCooldownDire ?? 0),
			DrawTimerRadarX,
			DrawTimerRadarY,
			DrawTimerRadarSize,
		)
	if (RadarStateInWorld.value) {
		// Radar Detect
		// loop-optimizer: FORWARD
		RadarDetect.forEach(x => {
			if (x === undefined || x.Name === undefined || !x.IsEnemy())
				return
			let Time = GameRules?.RawGameTime ?? 0
			if (x.Name === "npc_dota_thinker") {
				let ent = x as Unit
				if (ent.HasBuffByName("modifier_radar_thinker")) {
					if (!OtherRadius.has(x)) {
						CreateAbilityRadius(x, 900)
					}
					RendererSDK.DrawMiniMapIcon("minimap_ping_teleporting",
						ent.Position,
						RadarStateInWorldIconSize.value * 20,
						RadarStateInWorldMiniMapColor.Color)
					let pos_ent = RendererSDK.WorldToScreen(x.Position)
					if (pos_ent === undefined)
						return
					RendererSDK.Image("panorama/images/hud/reborn/icon_scan_on_psd.vtex_c",
						pos_ent.SubtractScalar(RadarStateInWorldIconSize.value / 4),
						new Vector2(RadarStateInWorldIconSize.value / 2, RadarStateInWorldIconSize.value / 2),
					)
					let BuffDieTime = ent.GetBuffByName("modifier_radar_thinker")
					if (BuffDieTime !== undefined) {
						RendererSDK.Text(
							BuffDieTime.RemainingTime.toFixed(2),
							pos_ent,
							RadarStateInWorldTextColor.Color,
							"Calibri",
							RadarStateInWorldTextSize.value,
							FontFlags_t.ANTIALIAS,
						)
					}
					if (Time >= checkTick) {
						GameState.ExecuteCommand("playvol sounds\\ui\\scan.vsnd " + RadarStateInWorldSound.value / 100)
						checkTick = Time + 5
					}
				}
			}
		})
	}
}

export function ScanGameEnded() {
	RadarDetect = []
}

export function ScanEntityCreated(x: Entity) {
	if (x instanceof Unit) {
		if (x.Name === undefined)
			return
		if (x.Name.includes("npc_dota_thinker"))
			RadarDetect.push(x)
	}
}
EventsSDK.on("EntityNameChanged", x => {
	if (x instanceof Unit) {
		if (x.Name === undefined)
			return
		if (x.Name.includes("npc_dota_thinker") && !RadarDetect.includes(x))
			RadarDetect.push(x)
	}
})

export function ScanEntityDestroyed(x: Entity) {
	if (x instanceof Entity)
		if (x.Name.includes("npc_dota_thinker"))
			ArrayExtensions.arrayRemove(RadarDetect, x)
}
