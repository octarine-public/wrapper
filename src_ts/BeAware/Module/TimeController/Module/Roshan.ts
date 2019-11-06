import { Color, Game, Menu, RendererSDK, Unit, Vector2 } from "wrapper/Imports"
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

} from "../Menu"

var Timer: number = 0,
	Units: Unit[] = [],
	checkTick: number = 0,
	roshanKillTime: number = 0,
	aegisPickUpTime: number = 0, // TODO for fireEvents
	checkTickMessage: number = 0,
	RoshanAttack: boolean = false,
	AegisTime: number = 0,
	Base: ManagerBase = new ManagerBase,
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
	if (Handle === 13891217767486593796n) {
		if (NotificationRoshanStateChat.value) {
			if (Timer < Game.GameTime) {
				Game.ExecuteCommand("chatwheel_say 53")
				Timer += (Game.GameTime + 10)
			}
		}
	}
	if (Handle === 14219564939631888289n) {
		if (NotificationRoshanStateChat.value) {
			Game.ExecuteCommand("chatwheel_say 53; chatwheel_say 57;") // > Roshan and time
		}
		Timer = 0
		roshanKillTime = 480
		AegisTime = 300 // transfer on fire events (Game events)
		IsAlive = false
	}
	if (Handle === 15464711547879317671n || Handle === 15359352600260660069n || Handle === 995145632723522745n) {
		AegisTime = 5
	}
}

function RenderIcon(position_unit: Vector2, path_icon: string, Size: Menu.Slider, color?: Color) {
	RendererSDK.Image(path_icon,
		position_unit.SubtractScalar(20 / 4).Clone().AddScalarY(4).AddScalarX(-Size.value - 5),
		new Vector2(Size.value * 1.2, Size.value * 1.2), Units.some(x => x.Name === "npc_dota_roshan")
		? new Color(252, 173, 3)
		: !color
			? new Color(255, 255, 255)
			: color,
	)
}

function RoshanDrawAliveDied(Text: string, color?: Color) {
	let VectorSize = RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value)
	if (IconSettingsState.value) {
		switch (IconSettingsSwitch.selected_id) {
			case 0:
				RenderIcon(VectorSize, "panorama/images/hud/icon_roshan_psd.vtex_c", drawStatusSize, color)
				break;
			case 1:
				RenderIcon(VectorSize, "panorama/images/hud/reborn/roshan_timer_roshan_psd.vtex_c", drawStatusSize, color)
				break;
		}
	}
	let is_under = Units.some(x => x.Name.includes("roshan"))
		? "Roshan is under attack"
		: Text
	RendererSDK.Text("Roshan: " + is_under, VectorSize, new Color(255, 255, 255, 255), "Calibri", drawStatusSize.value, FontFlags_t.ANTIALIAS)
}

export function RoshanTick() {
	if (Units.length <= 0) {
		return
	}
	let Time = Game.RawGameTime
	setTimeout(DeleteUnits, 250)
	if (Units.some(x => x.Name !== "npc_dota_roshan")) {
		return
	}
	if (Time >= checkTick) {
		Game.ExecuteCommand("playvol sounds\\ui\\ping_attack " + NotificationRoshanStateSound.value / 100)
		checkTick = Time + 4
	}
	if (!NotificationRoshanStateChat.value) {
		return
	}
	if (Time >= checkTickMessage) {
		Game.ExecuteCommand("chatwheel_say 53")
		checkTickMessage = Time + 10
	}
	return
}

export function DrawRoshan() {
	if (!drawStatus.value || !Game.IsInGame || Game.LevelNameShort === "hero_demo_main") {
		return false
	}
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
		if (TimersOne !== undefined && TimersTwo !== undefined) {
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
		Units.filter(x => {
			if (!x.Name.includes("roshan") && x.Distance2D(Base.RoshanPosition) <= 900) {
				RendererSDK.DrawMiniMapIcon("minimap_danger", Base.RoshanPosition, 900)
				RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${x.Name}`, Base.RoshanPosition, 900)
			}
		})
	}
	IsAlive
		? RoshanDrawAliveDied("Alive", IconSettingsColorAlive.Color)
		: RoshanDrawAliveDied("Died", IconSettingsColorDied.Color)
}

export function RoshanUnitAnimationCreate(unit: Unit) {
	if (!unit.IsValid || unit.IsVisible)
		return
	Units.push(unit)
}

function DeleteUnits() {
	Units = []
}

export function RoshanGameEnded() {
	DeleteUnits()
	checkTick = 0
	AegisTime = 0
	TimersOne = undefined
	TimersTwo = undefined
	aegisPickUpTime = 0
	checkTickMessage = 0
	RoshanAttack = false
	roshanKillTime = 0
	checkTickMessage = 0
	checkTick = 0
}