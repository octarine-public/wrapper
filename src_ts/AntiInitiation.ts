import * as Orders from "Orders"
import * as Utils from "Utils"

var Abils_ = [
		[ // HexAbils
			["lion_voodoo", true, true],
			["shadow_shaman_voodoo", true, true],
		],
		[ // DisableAbils
			["axe_berserkers_call", false],
			["puck_waning_rift", true],
			["crystal_maiden_frostbite", true],
			["skywrath_mage_ancient_seal", true],
			["doom_bringer_doom", false],
		],
		[ // StunAbils
			["dragon_knight_dragon_tail", true],
			["tidehunter_ravage", true],
			["earthshaker_echo_slam", false, true],
			["earthshaker_fissure", false],
			["magnataur_reverse_polarity", false],
			["beastmaster_primal_roar", true],
			["treant_overgrowth", false],
			["faceless_void_chronosphere", false],
			["batrider_flaming_lasso", true],
			["slardar_slithereen_crush", false],
			["enigma_black_hole", false],
			["shadow_shaman_shackles", false],
			["sven_storm_bolt", true],
			["lion_impale", true],
			["centaur_hoof_stomp", false],
			["vengefulspirit_magic_missile", true],
			["sand_king_burrowstrike", true],
			["nyx_assassin_impale", true],
			["chaos_knight_chaos_bolt", false],
			["tiny_avalanche", true],
			["ogre_magi_fireblast", true],
			["obsidian_destroyer_astral_imprisonment", true],
			["rubick_telekinesis", true],
			["pudge_dismember", true],
			["invoker_cold_snap", true],
			["invoker_tornado", true],
			["dark_seer_vacuum", true],
			["bane_nightmare", true],
			["rattletrap_hookshot", true],
			["tusk_walrus_kick", true],
		],
		[ // OtherAbils
			["dark_seer_wall_of_replica", false],
			["queenofpain_sonic_wave", false],
			["queenofpain_blink", false],
			["antimage_blink", false],
			["faceless_void_time_walk", false],
			["antimage_mana_void", false],
			["legion_commander_duel", false],
			["witch_doctor_death_ward", false],
			["rattletrap_power_cogs", false],
			["brewmaster_primal_split", false],
			["omniknight_guardian_angel", false],
			["lion_finger_of_death", false],
			["lina_laguna_blade", false],
			["juggernaut_omni_slash", false],
			["slark_pounce", false],
			["axe_culling_blade", false],
			["phoenix_supernova", false],
			["riki_smoke_screen", false],
			["riki_tricks_of_the_trade", false],
			["riki_blink_strike", false],
		],
		[ // AntiInitItems
			["item_sheepstick", true, true],
			["item_orchid", true, true],
			["item_bloodthorn", true, true],
			["item_cyclone", true, true],
			["item_blink", false, true],
			["item_heavens_halberd", true, true],
			["item_nullifier", true, true],
			["item_abyssal_blade", true, true],
		],
	].flat(1) as Array<[string, boolean, boolean?]>,
	BuffsDisablers_ = [[ // any _target_ (micro-)stun
		["lion_voodoo", true, true],
		["shadow_shaman_voodoo", true, true],
		["crystal_maiden_frostbite", true],
		["ogre_magi_fireblast", true],
		["lion_impale", true],
		["sven_storm_bolt", true],
		["beastmaster_primal_roar", true],
		["rubick_telekinesis", true],
		["sand_king_burrowstrike", true],
		["item_sheepstick", true, true],
		["item_cyclone", true, true],
		["item_heavens_halberd", true, true],
	]].flat(1) as Array<[string, boolean, boolean?]>,
	DisableBuffs: string[] = [
		"modifier_teleporting",
		"modifier_techies_suicide_leap",
		"modifier_monkey_king_bounce_leap",
		"modifier_spirit_breaker_charge_of_darkness",
	],
	config = {
		enabled: true,
		additional_delay: 0.03,

	},
	Abils: Array<[string, boolean, boolean?]> = [],
	BuffsDisablers: Array<[string, boolean, boolean?]> = [],
	heroes: C_DOTA_BaseNPC_Hero[] = []

Events.on("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (npc instanceof C_DOTA_BaseNPC_Hero && npc.IsEnemy(LocalDOTAPlayer) && npc.m_hReplicatingOtherHeroModel === undefined)
		heroes.push(npc)
})
Events.on("onEntityDestroyed", ent => {
	if (ent instanceof C_DOTA_BaseNPC)
		Utils.arrayRemove(heroes, ent)
})

function GetAbilArray(abilNameToSearch: string) {
	return Abils_.find(abilAr => abilAr[0] === abilNameToSearch)
}

var flags: boolean[] = [],
	disabling = false
Events.on("onTick", () => {
	if (!config.enabled)
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || pl_ent.m_bIsStunned || !pl_ent.m_bIsAlive || LocalDOTAPlayer.m_hActiveAbility !== undefined || disabling)
		return
	let needed_heroes = heroes.filter(hero => hero.m_bIsAlive && hero.m_bIsVisible && !flags[hero.m_iID])
	if (needed_heroes.some(hero => (hero.m_hAbilities as C_DOTABaseAbility[]).some(abil => abil !== undefined && Disable(pl_ent, hero, Abils, abil))))
		return
	if (needed_heroes.some(hero => hero.m_ModifierManager.m_vecBuffs.some(buff => DisableBuffs.includes(buff.m_name)) && Disable(pl_ent, hero, BuffsDisablers)))
		return
})

Events.on("onPrepareUnitOrders", order => order.unit !== LocalDOTAPlayer.m_hAssignedHero || !disabling)

function Disable(pl_ent: C_DOTA_BaseNPC, hero: C_DOTA_BaseNPC, DisableAr: Array<[string, boolean, boolean?]>, Abil?: C_DOTABaseAbility) {
	let delta = (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT) + Utils.GetRotationTime(pl_ent, hero.m_vecNetworkOrigin)) / 1000 + config.additional_delay
	if (Abil !== undefined) { // check that it can be disabled
		let AbilAr: [string, boolean, boolean?]
		if (
			!Abil.m_bInAbilityPhase
			|| GameRules.m_fGameTime - Abil.m_flCastStartTime < Abil.m_fCastPoint - delta
			|| (AbilAr = GetAbilArray(Abil.m_pAbilityData.m_pszAbilityName)) === undefined
			|| AbilAr[2]
		)
			return false
	}

	let disable_abil = DisableAr.filter(abilAr => abilAr[1]).map(abilAr => {
			let abil_name = abilAr[0]
			return abil_name.startsWith("item_") ? pl_ent.GetItemByName(abil_name) : pl_ent.GetAbilityByName(abil_name)
		}).find(abil => {
			if (abil === undefined)
				return false
			let cast_range = Utils.GetCastRange(pl_ent, abil)
			return !abil.m_bIsHidden
				&& abil.m_fCooldown === 0
				&& abil.IsManaEnough(pl_ent)
				&& (cast_range <= 0 || pl_ent.Distance2D(hero) <= cast_range + hero.m_flHullRadius * 2)
		})
	if (disable_abil === undefined)
		return false

	Orders.SmartCast(pl_ent, disable_abil, hero)
	disabling = flags[hero.m_iID] = true
	setTimeout(delta, () => disabling = flags[hero.m_iID] = false)

	return true
}

function TransformToAvailable(pl_ent: C_DOTA_BaseNPC, abil_arrays: Array<[string, boolean, boolean?]>): Array<[string, boolean, boolean?]> {
	let name = pl_ent.m_iszUnitName
	if (name === "npc_dota_hero_rubick" || name === "npc_dota_hero_morphling")
		return abil_arrays
	return abil_arrays.filter(abilData =>
		abilData[0].startsWith("item_")
		|| pl_ent.GetAbilityByName(abilData[0]) !== undefined,
	)
}

Events.on("onGameStarted", pl_ent => {
	Abils = TransformToAvailable(pl_ent, Abils_)
	BuffsDisablers = TransformToAvailable(pl_ent, BuffsDisablers_)
})

{
	let root = new Menu_Node("AntiInitiation")
	root.entries.push(new Menu_Toggle (
		"State",
		config.enabled,
		node => config.enabled = node.value,
	))
	root.entries.push(new Menu_SliderFloat (
		"Additional delay",
		config.additional_delay,
		0,
		0.1,
		node => config.additional_delay = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
