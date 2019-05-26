import { MenuManager, EventsSDK, PlayerResource, EntityManager } from "./CrutchesSDK/Imports";

let { MenuFactory } = MenuManager;

let setConVar = (value: number | string | boolean, menuBase: Menu_Base) =>
	ConVars.Set(menuBase.hint, value)

let debuggerMenu = MenuFactory("Debugger")

let sv_cheatsMenu = debuggerMenu.AddTree("sv_cheats tree")

let sv_cheats = sv_cheatsMenu.AddToggle("sv_cheats")
	.SetToolTip("sv_cheats")
	.OnValue(setConVar)

let wtf = sv_cheatsMenu.AddToggle("wtf")
	.SetToolTip("dota_ability_debug")
	.OnValue(setConVar)

let vision = sv_cheatsMenu.AddToggle("all vision")
	.SetToolTip("dota_all_vision")
	.OnValue(setConVar)

let creepsNoSpawn = sv_cheatsMenu.AddToggle("Creeps no spawning")
	.SetToolTip("dota_creeps_no_spawning")
	.OnValue(setConVar)

let refresh = sv_cheatsMenu.AddKeybind("Refresh")
	.SetToolTip("dota_hero_refresh")
	.OnRelease(self => SendToConsole(self.hint))

let localLvl = sv_cheatsMenu.AddKeybind("Local lvl max")
	.SetToolTip("dota_hero_level 25")
	.OnRelease(self => SendToConsole(self.hint))

let getRapGod = sv_cheatsMenu.AddKeybind("Get Rap God")
	.SetToolTip("dota_rap_god")
	.OnRelease(self => SendToConsole(self.hint))

let addUnitMenu = debuggerMenu.AddTree("add unit")

addUnitMenu.AddKeybind("Add full Sven")
	.OnRelease(() => {
		SendToConsole("dota_create_unit npc_dota_hero_sven enemy")

		setTimeout(() => {
			for (var i = 6; i--; )
				SendToConsole("dota_bot_give_item item_heart")

			SendToConsole("dota_bot_give_level 25")
		}, 1000)
	})

addUnitMenu.AddKeybind("Add creep")
	.SetToolTip("dota_create_unit npc_dota_creep_badguys_melee enemy")
	.OnRelease(self => SendToConsole(self.hint))

EventsSDK.on("onGameStarted", lp => {

	setConVar(sv_cheats.value, sv_cheats)
	setConVar(wtf.value, wtf)

	if (PlayerResource.AllPlayers.length <= 1)
		setConVar(vision.value, vision)

	setConVar(creepsNoSpawn.value, creepsNoSpawn)
})
/* 
let particle: number = undefined;

EventsSDK.on("onTick", () => {
	
	let hero = EntityManager.LocalHero,
		inFront = hero.InFront(300);
	
	console.log(inFront);
		
	if (particle === undefined) {
		particle = Particles.Create("particles/ui_mouseactions/range_finder_line.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, hero.m_pBaseEntity)
	}
	
	hero.Position.toIOBuffer();
	Particles.SetControlPoint(particle, 0);
	
	hero.Position.toIOBuffer();
	Particles.SetControlPoint(particle, 1);
	
	inFront.toIOBuffer();
	Particles.SetControlPoint(particle, 2);
})

EventsSDK.on("onGameEnded", () => {
	if (particle !== undefined)
		Particles.Destroy(particle, true);
}) */