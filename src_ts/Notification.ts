// import { Game, MenuManager, EventsSDK, Entity, RendererSDK } from "wrapper/Imports";
// let { MenuFactory } = MenuManager;
// const Notification = MenuFactory("Notification"),
// 	NotificationRoshanTree = Notification.AddTree("Roshan"),
// 	NotificationRoshanState = NotificationRoshanTree.AddToggle("State"),
// 	NotificationRoshanStateChat = NotificationRoshanTree.AddToggle("Chat").SetToolTip("Send notification to chat alies"),
// 	drawMenu = NotificationRoshanTree.AddTree("Draw"),
// 	drawStatus = drawMenu.AddToggle("Draw status"),
// 	statusPosX = drawMenu.AddSlider("Position X (%)", 47, 0, 100),
// 	statusPosY = drawMenu.AddSlider("Position Y (%)", 4, 0, 100),
// 	crutch = NotificationRoshanTree.AddTree("crutch"),
// 	IsAlive = crutch.AddCheckBox("IsAlive").SetToolTip("don't pick, crutch for save last alive rosh");
	
// EventsSDK.on("ParticleCreated", (Id: number, ParticlePath: string, Handle: bigint, Attach: ParticleAttachment_t, Entity: Entity) => {
// 	if (!NotificationRoshanState.value)
// 		return;
// 	console.log(Handle + " | " + ParticlePath)
// 	if (Handle === 7431777948785381669n) {
// 		if (NotificationRoshanStateChat.value)
// 			SendToConsole("say_team Roshan has respawned");
// 		IsAlive.ChangeValue(true);
// 	}
// 	if (Handle === 13891217767486593796n) {
// 		if (NotificationRoshanStateChat.value)
// 			SendToConsole("say_team Roshan is under attack");
// 	}
// 	if (Handle === 14219564939631888289n) {
// 		if (NotificationRoshanStateChat.value)
// 			SendToConsole("chatwheel_say 53; chatwheel_say 57;"); // > Roshan and time
// 		IsAlive.ChangeValue(false);
// 	}
// });
// EventsSDK.on("Draw", () => {
// 	if (!drawStatus.value || !Game.IsInGame)
// 		return
// 	let text = `${NotificationRoshanTree.name}: ${IsAlive.value ? "Alive" : "Dead"}`
// 	const wSize = RendererSDK.WindowSize
// 	Renderer.Text(
// 		wSize.x / 100 * statusPosX.value,
// 		wSize.y / 100 * statusPosY.value,
// 		text, 255, 255, 255, 100, "Radiance", 24,
// 	);
// });
// EventsSDK.on("GameEnded", () => {
// 	IsAlive.ChangeValue(false);
// });