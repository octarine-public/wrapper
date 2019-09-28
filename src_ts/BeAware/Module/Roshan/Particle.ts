import { Color, Game, RendererSDK, Vector2 } from "wrapper/Imports"
import { BaseTree, drawStatus, IsAlive, NotificationRoshanStateChat, State, statusPosX, statusPosY} from "./Menu"
var Timer: number = 0
export function ParticleCreate(Handle: BigInt) {
	if (!State.value || !Game.IsInGame)
		return false
	if (Handle === 7431777948785381669n) {
		IsAlive.OnValue(x => x.value = true)
		if (!State.value)
			return
		if (NotificationRoshanStateChat.value && Game.GameTime > 0) {
			Game.ExecuteCommand("say_team please check roshan")
			Timer = 0
		}
	}
	if (Handle === 13891217767486593796n) {
		if (NotificationRoshanStateChat.value) {
			if (Timer < Game.GameTime) {
				Game.ExecuteCommand("say_team please check roshan")
				Timer += (Game.GameTime + 10)
			}
		}
	}
	if (Handle === 14219564939631888289n) {
		if (NotificationRoshanStateChat.value) {
			Game.ExecuteCommand("chatwheel_say 53; chatwheel_say 57;") // > Roshan and time
			Timer = 0
		}
		IsAlive.OnValue(x => x.value = false)
	}
};

function RoshanDraw(Text: string, color?: Color) {
	let VectorSize = RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value)
	RendererSDK.Text(`${BaseTree.name}: ` + Text, VectorSize, new Color(255, 255, 255, 255), "Radiance", 24)
	//RendererSDK.Text("•", RendererSDK.WindowSize.DivideScalar(88).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value - 1.56), color, "Radiance", 44)
}

export function Draw() {
	if (!State.value || !drawStatus.value || !Game.IsInGame)
		return
	// RendererSDK.Image(`panorama/images/hud/reborn/roshan_timer_roshan_psd.vtex_c`,
	// 	RendererSDK.WindowSize.DivideScalar(105).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value),
	// 	new Vector2(64 / 2, 64 / 2), new Color(255,255,255))
	IsAlive.value
		? RoshanDraw("Alive", new Color(0, 255, 0, 255))
		: RoshanDraw("Died", new Color(255, 0, 0, 255))
}
