import { Color, Game, Menu, RendererSDK, Vector2, Player, LocalPlayer, Team, Roshan, Hero, EntityManager, Entity, FontFlags_t, PingType_t } from "wrapper/Imports"
import ManagerBase from "../../../abstract/Base"
import {
	AegisdrawStatusSize,
	AegisSettingsState,
	AegisSettingsStateIcon,
	AegisStatusPosX,
	AegisStatusPosY,

	drawStatus,
	drawStatusSize,
	IconSettingsColorAlive,
	IconSettingsColorDied,
	IconSettingsState,

	IconSettingsSwitch,
	NotificationRoshanStateChat,
	NotificationRoshanStateSound,
	statusPosX,
	statusPosY,
	UseScanForAlies,
	PingForAllies,
	drawImageHeroWorld
} from "../Menu"
import { RoshanPosition } from "../Entities"

var Timer = 0,
	Units: [Entity, number][] = [],
	checkTick = 0,
	roshanKillTime = 0,
	// aegisPickUpTime = 0, // TODO for fireEvents
	checkTickMessage = 0,
	// RoshanAttack = false,
	AegisTime = 0,
	Base = new ManagerBase(),
	TimersOne: string,
	TimersTwo: string,
	AegisTextTime: string,
	IsAlive = true


export function RoshanParticleCreate(Handle: bigint) {
	if (Handle === 7431777948785381669n) {
		if (NotificationRoshanStateChat.value && Game.GameTime > 0) {
			Game.ExecuteCommand("chatwheel_say 53")
			Timer = 0
		}
		IsAlive = true
	}
	if (
		Handle === 13891217767486593796n
		&& NotificationRoshanStateChat.value
		&& Timer < Game.GameTime
	) {
		Game.ExecuteCommand("chatwheel_say 53")
		Timer += (Game.GameTime + 10)
	}
	if (Handle === 14219564939631888289n) {
		if (NotificationRoshanStateChat.value)
			Game.ExecuteCommand("chatwheel_say 53; chatwheel_say 57;") // > Roshan and time
		Timer = 0
		roshanKillTime = 480
		AegisTime = 300 // transfer on fire events (Game events)
		IsAlive = false
	}
	if (Handle === 15464711547879317671n || Handle === 15359352600260660069n || Handle === 995145632723522745n)
		AegisTime = 5
}

function RenderIcon(position_unit: Vector2, path_icon: string, Size: Menu.Slider, color?: Color) {
	RendererSDK.Image(path_icon,
		position_unit.SubtractScalar(20 / 4).Clone().AddScalarY(4).AddScalarX(-Size.value - 5),
		new Vector2(Size.value * 1.2, Size.value * 1.2),
		Units.length !== 0
			? new Color(252, 173, 3)
			: color !== undefined
				? color
				: Color.White
	)
}

function RoshanDrawAliveDied(Text: string, color?: Color) {
	let VectorSize = RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value)
	if (IconSettingsState.value)
		switch (IconSettingsSwitch.selected_id) {
			case 0:
				RenderIcon(VectorSize, "panorama/images/hud/icon_roshan_psd.vtex_c", drawStatusSize, color)
				break
			case 1:
				RenderIcon(VectorSize, "panorama/images/hud/reborn/roshan_timer_roshan_psd.vtex_c", drawStatusSize, color)
				break
		}
	let is_under = Units.length !== 0
		? "Roshan is under attack"
		: Text
	RendererSDK.Text("Roshan: " + is_under, VectorSize, new Color(255, 255, 255, 255), "Calibri", drawStatusSize.value, FontFlags_t.ANTIALIAS)
}

export function RoshanTick() {
	let Time = Game.RawGameTime
	Units = Units.filter(ar => Time - ar[1] < 2)
	if (Units.length === 0)
		return
	if (Time >= checkTick) {
		Game.ExecuteCommand("playvol sounds\\ui\\ping_attack " + NotificationRoshanStateSound.value / 100)
		checkTick = Time + 4
	}
	if (Time >= checkTickMessage) {
		if (LocalPlayer !== undefined && Player !== undefined && UseScanForAlies.value) {
			let cd = LocalPlayer.Team === Team.Radiant
				? Game.ScanCooldownRadiant
				: Game.ScanCooldownDire
			if (cd === 0) {
				Player.Scan(RoshanPosition)
			}
			if (PingForAllies.value) {
				RoshanPosition.toIOBuffer()
				Minimap.SendPing(PingType_t.DANGER, false)
			}
		}
		if (NotificationRoshanStateChat.value)
			Game.ExecuteCommand("chatwheel_say 53")
		checkTickMessage = Time + 5
	}
}

export function DrawRoshan() {
	if (!drawStatus.value || !Game.IsInGame || Game.LevelNameShort === "hero_demo_main") {
		return
	}
	// if (LocalPlayer !== undefined)
	// 	console.log(LocalPlayer.Hero.Position)
	if (!IsAlive) {
		let time = Game.RawGameTime
		if (time >= checkTick) {
			let RoshTimeOne = --roshanKillTime,
				RoshTimeTwo = RoshTimeOne + 180
			if (Math.sign(RoshTimeOne) !== -1) {
				TimersOne = Base.TimeSecondToMin(RoshTimeOne)
			}
			if (Math.sign(RoshTimeTwo) !== -1) {
				TimersTwo = Base.TimeSecondToMin(RoshTimeTwo)
			}
			if (AegisSettingsState.value) {
				let Time = --AegisTime
				if (Math.sign(Time) !== -1) {
					AegisTextTime = Base.TimeSecondToMin(Time)
				}
			}
			checkTick = time + 1
		}
		if (TimersOne && TimersTwo) {
			let VectorSize = RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value).Clone().AddScalarX(+drawStatusSize.value * 4.7)
			RendererSDK.Text(TimersOne + ", " + TimersTwo, VectorSize, new Color(255, 255, 255, 255), "Calibri", drawStatusSize.value, FontFlags_t.ANTIALIAS)
		}
		if (AegisSettingsState.value && AegisTextTime !== undefined && AegisTime > 0) {
			let VectorSizeAegis = RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(AegisStatusPosX.value).MultiplyScalarY(AegisStatusPosY.value).Clone().AddScalarX(+AegisdrawStatusSize.value * 4.7)
			RendererSDK.Text("Aegis end: " + AegisTextTime, VectorSizeAegis, new Color(255, 255, 255, 255), "Calibri", AegisdrawStatusSize.value, FontFlags_t.ANTIALIAS)
			if (AegisSettingsStateIcon.value) {
				RenderIcon(VectorSizeAegis, "panorama/images/onstage_pods/aegis_png.vtex_c", AegisdrawStatusSize)
			}
		}
	}
	if (Units.length > 0) {
		RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Units[0][0].Name}`, RoshanPosition, 900)
		let screen_pos = RendererSDK.WorldToScreen(RoshanPosition)
		if (screen_pos !== undefined) {
			RendererSDK.Image(
				`panorama/images/heroes/icons/${Units[0][0].Name}_png.vtex_c`,
				screen_pos.SubtractScalar(drawImageHeroWorld.value / 4),
				new Vector2(drawImageHeroWorld.value / 2, drawImageHeroWorld.value / 2)
			)
		}
	}
	IsAlive
		? RoshanDrawAliveDied("Alive", IconSettingsColorAlive.Color)
		: RoshanDrawAliveDied("Died", IconSettingsColorDied.Color)
}

export function RoshanGameEvent(name: string, obj: any) {
	if (name !== "entity_hurt" && name !== "entity_killed")
		return
	let ent1: Entity | number = EntityManager.EntityByIndex(obj.entindex_killed) || obj.entindex_killed,
		ent2: Entity | number = EntityManager.EntityByIndex(obj.entindex_attacker) || obj.entindex_attacker
	if (
		ent1 === undefined || ent2 === undefined
		|| (!(ent1 instanceof Hero && ent1.IsValid && !ent1.IsVisible) && !(ent2 instanceof Hero && ent2.IsValid && !ent2.IsVisible))
		|| (!(ent1 instanceof Roshan || ent1 === EntityManager.Roshan) && !(ent2 instanceof Roshan || ent2 === EntityManager.Roshan))
	)
		return

	let hero = ent1 instanceof Hero ? ent1 : ent2
	let ar = Units.find(ar_ => ar_[0] === hero)
	if (ar === undefined) {
		Units.push([ent1 instanceof Hero ? ent1 : ent2 as Entity, Game.RawGameTime])
	} else
		ar[1] = Game.RawGameTime
}

export function RoshanGameEnded() {
	checkTick = 0
	AegisTime = 0
	TimersOne = ""
	TimersTwo = ""
	// aegisPickUpTime = 0
	checkTickMessage = 0
	// RoshanAttack = false
	roshanKillTime = 0
	checkTickMessage = 0
	checkTick = 0
	Units = []
}