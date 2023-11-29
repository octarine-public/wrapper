import { WrapperClass } from "../../Decorators"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GameState } from "../../Utils/GameState"
import { GameRules } from "../Base/Entity"
import { Item } from "../Base/Item"

@WrapperClass("item_aegis")
export class item_aegis extends Item {
	/**
	 * @readonly
	 */
	public static PickupTime = 0

	public get Cooldown(): number {
		const time = item_aegis.PickupTime + this.DisappearTime
		return Math.max(time - GameState.RawGameTime, 0)
	}

	public get DisappearTime() {
		const gameMode = GameRules?.GameMode ?? DOTAGameMode.DOTA_GAMEMODE_NONE
		const isTurbo = gameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		return this.GetSpecialValue(
			`${!isTurbo ? "disappear_time" : "disappear_time_turbo"}`
		)
	}

	public get Duration() {
		return this.DisappearTime
	}

	public get MaxDuration() {
		return this.DisappearTime
	}

	public get ReincarnateTime() {
		return this.GetSpecialValue("reincarnate_time")
	}
}

function updateAegisTime(eMsgType: DOTA_CHAT_MESSAGE) {
	switch (eMsgType) {
		case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_AEGIS:
		case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_AEGIS_STOLEN:
			item_aegis.PickupTime = GameState.RawGameTime
			break
		case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_DENIED_AEGIS:
			item_aegis.PickupTime = 0
			break
	}
}
EventsSDK.on("ChatEvent", eMsgType => updateAegisTime(eMsgType), Number.MIN_SAFE_INTEGER)

EventsSDK.on("GameEnded", () => (item_aegis.PickupTime = 0), Number.MIN_SAFE_INTEGER)

EventsSDK.on("GameStarted", () => (item_aegis.PickupTime = 0), Number.MIN_SAFE_INTEGER)
