import {
	EventsSDK,
	Game,
} from "wrapper/Imports"

let AegisExists = false;

function NotifyAegisEnd() {
	if (AegisExists) {
		SendToConsole("say_team aegis ended");
		AegisExists = false;
	}
}

EventsSDK.on("BuffAdded", (npc, buf) => {
	if (buf.Name == "modifier_item_aegis") {
		setTimeout(NotifyAegisEnd, 300000 - Math.floor(Game.GameTime - buf.CreationTime)); //aegis self destruct time
		AegisExists = true;
	}
});

EventsSDK.on("EntityDestroyed", ent => {
	if (ent.Name == "item_aegis") {
		NotifyAegisEnd();
	}
});
