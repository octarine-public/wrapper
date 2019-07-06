import { Game, RendererSDK } from "wrapper/Imports";
import { NotificationRoshanStateChat, IsAlive, BaseTree, State, statusPosX, statusPosY, drawStatus} from "./Menu";
var Timer: number = 0;
export function Create(Handle: BigInt) {
	IsAlive.ChangeValue(true);
	if (Handle === 7431777948785381669n) {
		if (!State.value)
			return;
		if (NotificationRoshanStateChat.value && Game.GameTime > 0){
			SendToConsole("say_team please check roshan");
			Timer = 0;
		}
	}
	if (Handle === 13891217767486593796n) {
		if (NotificationRoshanStateChat.value){
			if (Timer < Game.GameTime){
				SendToConsole("say_team please check roshan");
				Timer += (Game.GameTime + 10);
			}
		}
	}
	if (Handle === 14219564939631888289n) {
		if (NotificationRoshanStateChat.value) {
			SendToConsole("chatwheel_say 53; chatwheel_say 57;"); // > Roshan and time
			Timer = 0;
		}
		IsAlive.ChangeValue(false);
	}
};
export function Draw() {
	if (!drawStatus.value || !Game.IsInGame)
		return
	let text = `${BaseTree.name}: ${IsAlive.value ? "Alive" : "Dead"}`
	const wSize = RendererSDK.WindowSize
	Renderer.Text(
		wSize.x / 100 * statusPosX.value,
		wSize.y / 100 * statusPosY.value,
		text, 255, 255, 255, 100, "Radiance", 24,
	);
}