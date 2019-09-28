import {
	EventsSDK,
	Game,
	Menu as MenuSDK,
} from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Utility", "Aegis End"]),
	optionChatAlert = Menu.AddToggle("Chat alert")

let AegisExists = false

function NotifyAegisEnd() {
	if (AegisExists) {
		if (optionChatAlert.value)
			Game.ExecuteCommand("say_team aegis ended")
		AegisExists = false
	}
}

EventsSDK.on("BuffAdded", (npc, buf) => {
	if (buf.Name === "modifier_item_aegis") {
		setTimeout(NotifyAegisEnd, 300000 - Math.floor(Game.GameTime - buf.CreationTime)) //aegis self destruct time
		AegisExists = true
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent.Name === "item_aegis")
		NotifyAegisEnd()
})

EventsSDK.on("GameEnded", () => {
	AegisExists = false
})
