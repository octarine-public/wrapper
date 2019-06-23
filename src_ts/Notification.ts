import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug } from "wrapper/Imports";

let { MenuFactory } = MenuManager, IsAlive: boolean = false;

const Notification = MenuFactory("Notification"),
	  NotificationRoshanTree = Notification.AddTree("Roshan"),
	  NotificationRoshanState = NotificationRoshanTree.AddToggle("State"),
	  NotificationRoshanStateChat = NotificationRoshanTree.AddToggle("Chat").SetToolTip("Send notification to chat alies");

// const drawStatus 	= 	NotificationRoshanTree.AddToggle("Draw status"),
// 	  statusPosX 	= 	NotificationRoshanTree.AddSlider("Position X (%)", 0, 0, 100),
// 	  statusPosY 	= 	NotificationRoshanTree.AddSlider("Position Y (%)", 75, 0, 100)
	  
EventsSDK.on("onParticleCreated", (Id: number, ParticlePath: string, Handle: bigint, Attach: ParticleAttachment_t, Entity: Entity) => {

	if (!NotificationRoshanState.value)
		return;

	if (ParticlePath === "particles/neutral_fx/roshan_spawn.vpcf") {

		if (NotificationRoshanStateChat.value)
			SendToConsole("say_team Roshan has respawned");

		IsAlive = true;
	}

	if (ParticlePath === "particles/neutral_fx/roshan_slam.vpcf") {

		if (NotificationRoshanStateChat.value)
			SendToConsole("say_team Roshan is under attack");
		
	}

	if (ParticlePath === "particles/generic_gameplay/dropped_aegis.vpcf") {

		if (NotificationRoshanStateChat.value)
			SendToConsole("chatwheel_say 53; chatwheel_say 57;"); // > Roshan and time

		IsAlive = false;
	}
});

// EventsSDK.on("onDraw", () => {
	
// 	if (!drawStatus.value || !Game.IsInGame)
// 		return

// 	let text = ""

// 	// // rune
// 	// text += `${stateRune.name}: ${(stateRune.value || runeHoldKey.IsPressed) ? "On" : "Off"}`

// 	// text += " | "

// 	// // items
// 	// text += `${stateItems.name}: ${(stateItems.value || itemsHoldKey.IsPressed) ? "On" : "Off"}`

// 	const wSize = RendererSDK.WindowSize

// 	Renderer.Text(
// 		wSize.x / 100 * statusPosX.value,
// 		wSize.y / 100 * statusPosY.value,
// 		text,
// 	)
// })



EventsSDK.on("onGameEnded", () => {
	IsAlive = undefined;
});

// EventsSDK.on("onTick", () => {
// });


/* 
	TODO:
	 - Particle:
		particles/generic_gameplay/generic_lifesteal.vpcf | attach: 1 | Entity npc_dota_hero_sven | tree tal. +25% in lifesteal
		
*/