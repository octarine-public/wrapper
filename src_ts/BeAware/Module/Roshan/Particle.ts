import { Color, Game, RendererSDK } from "wrapper/Imports"
import { BaseTree, drawStatus, IsAlive, NotificationRoshanStateChat, State, statusPosX, statusPosY} from "./Menu"
var Timer: number = 0
export function ParticleCreate(Handle: BigInt) {
	if (Handle === 7431777948785381669n) {
		IsAlive.ChangeValue(true)
		if (!State.value)
			return
		if (NotificationRoshanStateChat.value && Game.GameTime > 0) {
			SendToConsole("say_team please check roshan")
			Timer = 0
		}
	}
	if (Handle === 13891217767486593796n) {
		if (NotificationRoshanStateChat.value) {
			if (Timer < Game.GameTime) {
				SendToConsole("say_team please check roshan")
				Timer += (Game.GameTime + 10)
			}
		}
	}
	if (Handle === 14219564939631888289n) {
		if (NotificationRoshanStateChat.value) {
			SendToConsole("chatwheel_say 53; chatwheel_say 57;") // > Roshan and time
			Timer = 0
		}
		IsAlive.ChangeValue(false)
	}
};
export function Draw() {
	if (!drawStatus.value || !Game.IsInGame)
		return
	RendererSDK.Text (
		`${BaseTree.name}: ${IsAlive.value ? "Alive" : "Dead"}`,
		RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value),
		new Color(255, 255, 255, 100),
		"Radiance",
		24,
	)
}