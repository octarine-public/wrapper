import { Color, EventsSDK, Hero, Menu, PlayerResource, ProjectileManager, RendererSDK, Vector2, Game, LocalPlayer, EntityManager } from "./wrapper/Imports"

let setConVar = (toggle: Menu.Toggle) =>
	ConVars.Set(toggle.tooltip,toggle.value)

let debuggerMenu = Menu.AddEntry("Debugger")

let sv_cheatsMenu = debuggerMenu.AddNode("Concommands")

let sv_cheats = sv_cheatsMenu.AddToggle("sv_cheats")
	.SetTooltip("sv_cheats")
	.OnValue(setConVar)

let wtf = sv_cheatsMenu.AddToggle("wtf")
	.SetTooltip("dota_ability_debug")
	.OnValue(setConVar)

let vision = sv_cheatsMenu.AddToggle("all vision")
	.SetTooltip("dota_all_vision")
	.OnValue(setConVar)

let creepsNoSpawn = sv_cheatsMenu.AddToggle("Creeps no spawning")
	.SetTooltip("dota_creeps_no_spawning")
	.OnValue(setConVar)

sv_cheatsMenu.AddKeybind("Refresh")
	.SetTooltip("dota_hero_refresh")
	.OnRelease(self => SendToConsole(self.tooltip))

let ability_abuse = sv_cheatsMenu.AddKeybind("Ability Abuse")
let ability_abuse_selector = sv_cheatsMenu.AddImageSelector("Ability Abuse Selector", [
	"witch_doctor_voodoo_restoration",
	"medusa_mana_shield",
	"invoker_exort",
	"bristleback_quill_spray",
	"item_shadow_amulet",
	"item_shivas_guard",
])

sv_cheatsMenu.AddButton("Local lvl max")
	.SetTooltip("dota_hero_level 25")
	.OnValue(self => SendToConsole(self.tooltip))

sv_cheatsMenu.AddButton("Get Rap God")
	.SetTooltip("dota_rap_god")
	.OnValue(self => SendToConsole(self.tooltip))

let addUnitMenu = debuggerMenu.AddNode("add unit")

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
	.SetTooltip("dota_create_unit npc_dota_creep_badguys_melee enemy")
	.OnRelease(self => SendToConsole(self.tooltip))

EventsSDK.on("GameStarted", () => {
	ConVars.Set("sv_cheats", ConVars.GetInt("sv_cheats") || sv_cheats.value)
	ConVars.Set("dota_ability_debug", wtf.value)

	if (PlayerResource.AllPlayers.length <= 1)
		ConVars.Set("dota_all_vision", vision.value)

	ConVars.Set("dota_creeps_no_spawning", creepsNoSpawn.value)
})

// ======================= DEBUGGING EVENTS

const debugEventsMenu = debuggerMenu.AddNode("Debugging events", "Debugging native events in console")

const debugEvents = debugEventsMenu.AddToggle("Debugging events")
const debugOnlyThrowEvents = debugEventsMenu.AddToggle("Debugging only throw", true)

const debugDrawEvents = debugEventsMenu.AddToggle("Debug Draw")

const debugEntitiesEvents = debugEventsMenu.AddToggle("Debug Entities")
const debugBuffsEvents = debugEventsMenu.AddToggle("Debug Buffs")

const debugOtherEvents = debugEventsMenu.AddToggle("Debug Other")
const debugProjectiles = debugEventsMenu.AddToggle("Debug projectiles", false, "Visual only")
EventsSDK.on("GameStarted", pl_ent => {
	if (!debugEvents.value || !debugOtherEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onGameStarted", pl_ent)

	if (!(pl_ent instanceof Hero))
		throw "onGameStarted. pl_ent is not C_DOTA_BaseNPC_Hero: " + pl_ent
})
EventsSDK.on("GameEnded", () => {
	if (!debugEvents.value || !debugOtherEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onGameEnded")
})
Events.on("EntityCreated", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onEntityCreated", ent, id)
})
Events.on("EntityDestroyed", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onEntityCreated", ent, id)
})
Events.on("UnitStateChanged", npc => {
	if (!debugEvents.value || !debugOtherEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onUnitStateChanged", npc)
})
Events.on("TeamVisibilityChanged", (npc, newTagged) => {
	if (!debugEvents.value || !debugOtherEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onTeamVisibilityChanged", npc, newTagged)
})
Events.on("Draw", () => {
	if (!debugEvents.value || !debugDrawEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onDraw")
})
Events.on("ParticleCreated", (...args) => debugConsole("onParticleCreated", ...args))
Events.on("ParticleUpdated", (...args) => debugConsole("onParticleUpdated", ...args))
Events.on("ParticleUpdatedEnt", (...args) => debugConsole("onParticleUpdatedEnt", ...args))
Events.on("BloodImpact", (...args) => debugConsole("onBloodImpact", ...args))
Events.on("PrepareUnitOrders", order => {
	if (!debugEvents.value || !debugOtherEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onPrepareUnitOrders", order)
})
Events.on("UnitAnimation", (...args) => debugConsole("onUnitAnimation", ...args))
Events.on("UnitAnimationEnd", (...args) => debugConsole("onUnitAnimation", ...args))
Events.on("BuffAdded", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffAdded", npc, buff)
})
Events.on("BuffRemoved", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffRemoved", npc, buff)
})
Events.on("BuffStackCountChanged", buff => {
	if (!debugEvents.value || !debugBuffsEvents.value) return

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffStackCountChanged", buff)
})
Events.on("CustomGameEvent", (...args) => debugConsole("onCustomGameEvent", ...args))

let debugConsole = (name: string, ...args: any) =>
	debugEvents.value && !debugOnlyThrowEvents.value && debugOtherEvents.value && console.log(name, ...args)

EventsSDK.on("Draw", () => {
	if (!debugEvents.value || debugOnlyThrowEvents.value || !debugProjectiles.value || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	ProjectileManager.AllTrackingProjectiles.filter(proj => !proj.HadHitTargetLoc).forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(255))
	})
	ProjectileManager.AllLinearProjectiles.forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(255))
	})
})

EventsSDK.on("Tick", () => {
	if (!ability_abuse.is_pressed)
		return
	EntityManager.AllEntities.filter(ent => ent instanceof Hero && ent.IsControllableByPlayer(LocalPlayer.PlayerID)).forEach((MyEnt: Hero) => {
		if (MyEnt.IsStunned)
			return
		let repeated_unit = new Array<C_BaseEntity>(0x80/*max: 0x3FFF*/).fill(MyEnt.m_pBaseEntity)
		let ability = ability_abuse_selector.IsEnabled("witch_doctor_voodoo_restoration") ? MyEnt.GetAbilityByName("witch_doctor_voodoo_restoration") : undefined
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return
		}
		if (ability_abuse_selector.IsEnabled("medusa_mana_shield"))
			ability = MyEnt.GetAbilityByName("medusa_mana_shield")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return
		}
		if (ability_abuse_selector.IsEnabled("invoker_exort"))
			ability = MyEnt.GetAbilityByName("invoker_exort")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return
		}
		if (ability_abuse_selector.IsEnabled("bristleback_quill_spray"))
			ability = MyEnt.GetAbilityByName("bristleback_quill_spray")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return
		}
		if (ability_abuse_selector.IsEnabled("item_shivas_guard"))
			ability = MyEnt.GetItemByName("item_shivas_guard")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
			})
			return
		}
		if (ability_abuse_selector.IsEnabled("item_shadow_amulet"))
			ability = MyEnt.GetItemByName("item_shadow_amulet")
		if (ability !== undefined && ability.CanBeCasted()) {
			PrepareUnitOrders({
				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
				Ability: ability.m_pBaseEntity,
				OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
				Unit: repeated_unit,
				Queue: false,
				ShowEffects: false,
				Target: MyEnt.m_pBaseEntity,
			})
			return
		}
		MyEnt.UseSmartAbility(ability, MyEnt)
	})
})
