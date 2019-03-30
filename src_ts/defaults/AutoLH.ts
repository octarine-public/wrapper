import * as Orders from "Orders"
import * as Utils from "Utils"
enum AutoLH_Mode {
	LASTHIT = 1,
	DENY,
	BOTH
}

var attack_anim_point = {
		npc_dota_hero_base: 0.75,
		npc_dota_hero_antimage: 0.3,
		npc_dota_hero_axe: 0.5,
		npc_dota_hero_bane: 0.3,
		npc_dota_hero_bloodseeker: 0.43,
		npc_dota_hero_crystal_maiden: 0.55,
		npc_dota_hero_drow_ranger: 0.65,
		npc_dota_hero_earthshaker: 0.467,
		npc_dota_hero_juggernaut: 0.33,
		npc_dota_hero_mirana: 0.3,
		npc_dota_hero_nevermore: 0.5,
		npc_dota_hero_morphling: 0.5,
		npc_dota_hero_phantom_lancer: 0.5,
		npc_dota_hero_puck: 0.5,
		npc_dota_hero_pudge: 0.5,
		npc_dota_hero_razor: 0.3,
		npc_dota_hero_sand_king: 0.53,
		npc_dota_hero_storm_spirit: 0.5,
		npc_dota_hero_sven: 0.4,
		npc_dota_hero_tiny: 0.4,
		npc_dota_hero_vengefulspirit: 0.33,
		npc_dota_hero_windrunner: 0.4,
		npc_dota_hero_zuus: 0.633,
		npc_dota_hero_kunkka: 0.4,
		npc_dota_hero_lina: 0.75,
		npc_dota_hero_lich: 0.46,
		npc_dota_hero_lion: 0.43,
		npc_dota_hero_shadow_shaman: 0.3,
		npc_dota_hero_slardar: 0.36,
		npc_dota_hero_tidehunter: 0.6,
		npc_dota_hero_witch_doctor: 0.4,
		npc_dota_hero_riki: 0.3,
		npc_dota_hero_enigma: 0.4,
		npc_dota_hero_tinker: 0.35,
		npc_dota_hero_sniper: 0.17,
		npc_dota_hero_necrolyte: 0.4,
		npc_dota_hero_warlock: 0.3,
		npc_dota_hero_beastmaster: 0.3,
		npc_dota_hero_queenofpain: 0.56,
		npc_dota_hero_venomancer: 0.3,
		npc_dota_hero_faceless_void: 0.5,
		npc_dota_hero_skeleton_king: 0.56,
		npc_dota_hero_death_prophet: 0.56,
		npc_dota_hero_phantom_assassin: 0.3,
		npc_dota_hero_pugna: 0.5,
		npc_dota_hero_templar_assassin: 0.3,
		npc_dota_hero_viper: 0.33,
		npc_dota_hero_luna: 0.46,
		npc_dota_hero_dragon_knight: 0.5,
		npc_dota_hero_dazzle: 0.3,
		npc_dota_hero_rattletrap: 0.33,
		npc_dota_hero_leshrac: 0.4,
		npc_dota_hero_furion: 0.4,
		npc_dota_hero_life_stealer: 0.39,
		npc_dota_hero_dark_seer: 0.59,
		npc_dota_hero_clinkz: 0.7,
		npc_dota_hero_omniknight: 0.433,
		npc_dota_hero_enchantress: 0.3,
		npc_dota_hero_huskar: 0.4,
		npc_dota_hero_night_stalker: 0.55,
		npc_dota_hero_broodmother: 0.4,
		npc_dota_hero_bounty_hunter: 0.59,
		npc_dota_hero_weaver: 0.64,
		npc_dota_hero_jakiro: 0.4,
		npc_dota_hero_batrider: 0.3,
		npc_dota_hero_chen: 0.5,
		npc_dota_hero_spectre: 0.3,
		npc_dota_hero_doom_bringer: 0.5,
		npc_dota_hero_ancient_apparition: 0.45,
		npc_dota_hero_ursa: 0.3,
		npc_dota_hero_spirit_breaker: 0.6,
		npc_dota_hero_gyrocopter: 0.2,
		npc_dota_hero_alchemist: 0.35,
		npc_dota_hero_invoker: 0.4,
		npc_dota_hero_silencer: 0.5,
		npc_dota_hero_obsidian_destroyer: 0.46,
		npc_dota_hero_lycan: 0.55,
		npc_dota_hero_brewmaster: 0.35,
		npc_dota_hero_shadow_demon: 0.35,
		npc_dota_hero_lone_druid: 0.33,
		npc_dota_hero_chaos_knight: 0.5,
		npc_dota_hero_meepo: 0.38,
		npc_dota_hero_treant: 0.6,
		npc_dota_hero_ogre_magi: 0.3,
		npc_dota_hero_undying: 0.3,
		npc_dota_hero_rubick: 0.4,
		npc_dota_hero_disruptor: 0.4,
		npc_dota_hero_nyx_assassin: 0.46,
		npc_dota_hero_naga_siren: 0.5,
		npc_dota_hero_keeper_of_the_light: 0.3,
		npc_dota_hero_wisp: 0.15,
		npc_dota_hero_visage: 0.46,
		npc_dota_hero_slark: 0.5,
		npc_dota_hero_medusa: 0.5,
		npc_dota_hero_troll_warlord: 0.3,
		npc_dota_hero_centaur: 0.3,
		npc_dota_hero_magnataur: 0.5,
		npc_dota_hero_shredder: 0.36,
		npc_dota_hero_bristleback: 0.3,
		npc_dota_hero_tusk: 0.36,
		npc_dota_hero_skywrath_mage: 0.4,
		npc_dota_hero_abaddon: 0.56,
		npc_dota_hero_elder_titan: 0.35,
		npc_dota_hero_legion_commander: 0.46,
		npc_dota_hero_ember_spirit: 0.4,
		npc_dota_hero_earth_spirit: 0.35,
		npc_dota_hero_terrorblade: 0.3,
		npc_dota_hero_phoenix: 0.35,
		npc_dota_hero_oracle: 0.3,
		npc_dota_hero_techies: 0.5,
		npc_dota_hero_target_dummy: 0.5,
		npc_dota_hero_winter_wyvern: 0.25,
		npc_dota_hero_arc_warden: 0.3,
		npc_dota_hero_abyssal_underlord: 0.45,
		npc_dota_hero_monkey_king: 0.45,
		npc_dota_hero_pangolier: 0.33,
		npc_dota_hero_dark_willow: 0.3,
		npc_dota_hero_grimstroke: 0.35,
		npc_dota_hero_mars: 0.4,
	},	
	config = {
		hotkey: 0,
		creep_hp_offset: 0,
		melee_time_offset: 0,
		delay_multiplier: 1700,
		mode: 0,
		glow_only: false,
		glow_enabled: true,
		glow_finder_range: 1500
	},
	enabled = false,
	block_orders = false,
	attackable_ents: C_DOTA_BaseNPC[] = [],
	glow_ents: C_DOTA_BaseNPC[] = [],
	glow_ents_old: C_DOTA_BaseNPC[] = []

function EnoughDamage(sender: C_DOTA_BaseNPC_Hero, target: C_DOTA_BaseNPC, cur_time: number): boolean {
	let delay = 1 / sender.m_fAttacksPerSecond + Utils.GetProjectileDelay(sender, target) + Utils.GetRotationTime(sender, target.m_vecNetworkOrigin) / 1000
	return target.CalculateDamageByHand(sender) > Utils.GetHealthAfter(target, delay, false, sender, config.melee_time_offset) - config.creep_hp_offset
}

Events.addListener("onDraw", () => {
	if (enabled)
		Renderer.Text(0, 0, "Auto LastHit enabled")
	else {
		glow_ents_old = glow_ents
		glow_ents = []
	}
	glow_ents_old.filter(ent => ent.m_bIsValid && !glow_ents.includes(ent)).forEach(ent => {
		ent.m_bSuppressGlow = true
		ent.m_Glow.m_bGlowing = false
		ent.m_Glow.m_iGlowType = 0
	})
	glow_ents.forEach(ent => {
		ent.m_bSuppressGlow = false
		ent.m_Glow.m_bFlashing = false
		ent.m_Glow.m_bGlowing = true
		ent.m_Glow.m_iGlowType = 1
		ent.m_Glow.m_glowColorOverride.r = 255
		ent.m_Glow.m_glowColorOverride.g = 0
		ent.m_Glow.m_glowColorOverride.b = 0
	})
	glow_ents_old = glow_ents
})

Events.addListener("onTick", () => {
	if (!enabled || IsPaused())
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero
	if (pl_ent === undefined || !pl_ent.m_bIsAlive)
		return
	let cur_time = GameRules.m_fGameTime,
		pl_ent_pos = pl_ent.m_vecNetworkOrigin,
		pl_ent_team = pl_ent.m_iTeamNum,
		attack_range = pl_ent.m_fAttackRange * (pl_ent.m_bIsRangedAttacker ? 1 : 1.5) + pl_ent.m_flHullRadius,
		max_range = Math.max(attack_range, config.glow_finder_range)
	let filtered = Utils.orderBy((attackable_ents.filter(ent => {
		if (!ent.m_bIsValid || !ent.m_bIsAlive || !ent.m_bIsVisible)
			return false
		if ((config.mode & AutoLH_Mode.LASTHIT) && (ent.m_iTeamNum !== pl_ent_team))
			return true
		if ((config.mode & AutoLH_Mode.DENY) && (ent.m_iTeamNum === pl_ent_team) && ent.m_bIsDeniable)
			return true
		return false
	}).map(ent => [ent, ent.m_vecNetworkOrigin.DistTo(pl_ent_pos)]) as [C_DOTA_BaseNPC, number][]).filter(([ent, dist]) => dist <= max_range).filter(([ent, dist]) => EnoughDamage(pl_ent, ent, cur_time)), ([creep]) => creep.m_iHealth)
	glow_ents = (config.glow_enabled && config.glow_finder_range !== 0 ? config.glow_finder_range !== -1 ? filtered.filter(([ent, dist]) => dist <= config.glow_finder_range) : filtered : []).map(a => a[0])
	if (!config.glow_only || block_orders) {
		let ent_pair = filtered.filter(([ent, dist]) => dist <= (attack_range + ent.m_flHullRadius))[0]
		if (ent_pair === undefined)
			return
		let ent = ent_pair[0]
		Orders.AttackTarget(pl_ent, ent, false)
		block_orders = true
		let done = false
		let id = setInterval(30, id => {
			if (!ent.m_bIsValid || !ent.m_bIsAlive) {
				block_orders = false
				done = true
				clearInterval(id)
			}
		})
		setTimeout(1000 / pl_ent.m_fAttacksPerSecond - (attack_anim_point[pl_ent.m_iszUnitName] * config.delay_multiplier), () => {
			if (!done)
				clearInterval(id)
			block_orders = false
		})
	}
})
Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (npc.m_bIsCreep)
		attackable_ents.push(npc)
})
Events.addListener("onEntityDestroyed", ent => {
	const index = attackable_ents.indexOf(ent as C_DOTA_BaseNPC)
	if (index !== -1)
		attackable_ents.splice(index, 1)
})
Events.addListener("onPrepareUnitOrders", order => enabled && !config.glow_only ? Utils.GetOrdersWithoutSideEffects().includes(order.order_type) || !block_orders : true)
Events.addListener("onWndProc", (message_type, wParam) => {
	if (!IsInGame() || parseInt(wParam as any) !== config.hotkey)
		return true
	if (message_type === 0x100) // WM_KEYDOWN
		return false
	else if (message_type === 0x101) { // WM_KEYUP
		if (!(enabled = !enabled))
			glow_ents = []
		return false
	}
	return true
})
Events.addListener("onGameEnded", () => {
	enabled = false
	glow_ents = glow_ents_old = []
})

{
	let root = new Menu_Node("Auto LastHit")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		"Hotkey is in toggle mode",
		node => config.hotkey = node.value
	))
	root.entries.push(new Menu_SliderInt (
		"Creep HP offset",
		config.creep_hp_offset,
		-15,
		15,
		node => config.creep_hp_offset = node.value
	))
	root.entries.push(new Menu_SliderFloat (
		"Melee attack time offset",
		config.melee_time_offset,
		-0.2,
		0.2,
		node => config.melee_time_offset = node.value
	))
	root.entries.push(new Menu_SliderFloat (
		"Delay multiplier after attack",
		-config.delay_multiplier / 1000,
		-2.5,
		0,
		node => config.delay_multiplier = -node.value * 1000
	))
	root.entries.push(new Menu_Combo (
		"Glow mode",
		[
			"Enabled",
			"Disabled"
		],
		config.glow_enabled ? 0 : 1,
		node => config.glow_enabled = node.selected_id === 0
	))
	root.entries.push(new Menu_SliderInt (
		"Glow finder range",
		config.glow_finder_range,
		0,
		1500,
		node => config.glow_finder_range = node.value
	))
	root.entries.push(new Menu_Combo (
		"Mode",
		[
			"None",
			"Lasthit",
			"Deny",
			"Both",
			"Show only"
		],
		0,
		node => {
			if (node.selected_id === 4) {
				config.mode = 3
				config.glow_only = true
			} else {
				config.mode = node.selected_id
				config.glow_only = false
			}
		}
	))
	root.Update()
	Menu.AddEntry(root)
}
