import { LaneSelection } from "../Enums/LaneSelection"
import { Team } from "../Enums/Team"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import {
	AbilityImagePath,
	HeroIconsPath,
	HeroImagePath,
	ImagePath,
	ItemImagePath,
	RunePath,
	WrapperImagePath,
	WrapperMenuPath
} from "./PathData"

const getTexturePath = (name: string, isItem = false): string => {
	if (name === "") {
		return ""
	}
	const abilityData = AbilityData.GetAbilityByName(name)
	if (abilityData !== undefined && abilityData.TexturePath.length !== 0) {
		return abilityData.TexturePath
	}
	if (!isItem) {
		switch (name) {
			case "invoker_cataclysm":
				return Icons.invoker_cataclysm
			default:
				return AbilityImagePath + "/" + name + "_png.vtex_c"
		}
	}
	name = !name.includes("recipe_")
		? name.replace("item_", "")
		: name.replace("item_", "recipe_")
	return ItemImagePath + "/" + name + "_png.vtex_c"
}

const hud = `${ImagePath}/hud`
const mask = `${ImagePath}/masks`
const reborn = `${hud}/reborn`

export const Icons = {
	topbar_mana: `${reborn}/topbar_mana_psd.vtex_c`,
	invoker_cataclysm: `${AbilityImagePath}/invoker/magus_apex/invoker_sun_strike_png.vtex_c`,
	topbar_health: `${reborn}/topbar_health_psd.vtex_c`,
	topbar_health_dire: `${reborn}/topbar_health_dire_psd.vtex_c`,
	topbar_health_colorblind: `${reborn}/topbar_health_colorblind_psd.vtex_c`,
	buyback_header: `${reborn}/buyback_header_psd.vtex_c`,
	buyback_topbar: `${reborn}/topbar_buyback_psd.vtex_c`,
	buyback_topbar_alive: `${reborn}/buyback_topbar_alive_psd.vtex_c`,
	ult_cooldown: `${reborn}/ult_cooldown_psd.vtex_c`,
	buff_outline: `${reborn}/buff_outline_psd.vtex_c`,
	ult_no_mana: `${reborn}/ult_no_mana_psd.vtex_c`,
	ult_ready: `${reborn}/ult_ready_psd.vtex_c`,
	softedge_circle_sharp: `${mask}/softedge_circle_sharp_png.vtex_c`,
	chat_preview_opacity_mask: `${mask}/chat_preview_opacity_mask_png.vtex_c`,
	arrow_gold_dif: `${reborn}/arrow_gold_dif_psd.vtex_c`,
	arrow_plus_stats_red: `${reborn}/arrow_plus_stats_red_psd.vtex_c`,
	softedge_horizontal: `${mask}/softedge_horizontal_png.vtex_c`,
	levelup_button_3: `${reborn}/levelup_button_3_psd.vtex_c`,
	levelup_button_5: `${reborn}/levelup_button_5_psd.vtex_c`,
	icon_damage: `${reborn}/icon_damage_psd.vtex_c`,
	icon_speed: `${reborn}/icon_speed_psd.vtex_c`,
	icon_dota_plus: `${ImagePath}/plus/achievements/plus_icon_png.vtex_c`,
	icon_send_message: `${ImagePath}/profile/icon_send_message_psd.vtex_c`,
	icon_scan: `${reborn}/icon_scan_on_psd.vtex_c`,
	icon_ward: `${ImagePath}/icon_ward_psd.vtex_c`,
	icon_ward_observer: `${ItemImagePath}/ward_observer_png.vtex_c`,
	icon_ward_sentry: `${ItemImagePath}/ward_sentry_png.vtex_c`,
	icon_settings: `${ImagePath}/control_icons/gear_png.vtex_c`,
	check_png: `${ImagePath}/control_icons/check_png.vtex_c`,
	icon_brackets: `${ImagePath}/control_icons/brackets_png.vtex_c`,
	icon_roshan: `${hud}/icon_roshan_psd.vtex_c`,
	icon_glyph_small: `${hud}/icon_glyph_small_psd.vtex_c`,
	icon_scan_on: `${reborn}/icon_scan_on_psd.vtex_c`,
	icon_glyph_on: `${reborn}/icon_glyph_on_psd.vtex_c`,
	kill_mask: `${ImagePath}/status_icons/modifier_kill_effect_psd.vtex_c`,
	dead_icon: `${reborn}/dead_icon_psd.vtex_c`,
	gold_large: `${reborn}/gold_large_png.vtex_c`,
	transfer_arrow_png: `${reborn}/toast_neutral_item_transfer_arrow_png.vtex_c`,
	tower_radiant: `${ImagePath}/heroes/npc_dota_hero_tower_radiant_png.vtex_c`,
	tower_dire: `${ImagePath}/heroes/npc_dota_hero_tower_dire_png.vtex_c`,
	outpost: `${hud}/icon_outpost_psd.vtex_c`,
	roshan_timer_roshan: `${reborn}/roshan_timer_roshan_psd.vtex_c`,
	outpost_lose: `${hud}/icon_outpost_lost_psd.vtex_c`,
	outpost_captured: `${hud}/icon_outpost_captured_psd.vtex_c`,
	hardsupport: `${ImagePath}/rank_tier_icons/handicap/hardsupporticon_psd.vtex_c`,
	softsupport: `${ImagePath}/rank_tier_icons/handicap/softsupporticon_psd.vtex_c`,
	offlane: `${ImagePath}/rank_tier_icons/handicap/offlaneicon_psd.vtex_c`,
	midlane: `${ImagePath}/rank_tier_icons/handicap/midlaneicon_psd.vtex_c`,
	safelane: `${ImagePath}/rank_tier_icons/handicap/safelaneicon_psd.vtex_c`,
	roshan_slam: `${AbilityImagePath}/roshan_slam_png.vtex_c`,
	roshan_bash: `${AbilityImagePath}/roshan_bash_png.vtex_c`,
	roshans_gift: `${ImagePath}/econ/tools/roshans_gift_png.vtex_c`,
	roshan_halloween_levels: `${AbilityImagePath}/roshan_halloween_levels_png.vtex_c`,
	roshan_halloween_angry: `${AbilityImagePath}/roshan_halloween_angry_png.vtex_c`,
	gradient_leftright: `${mask}/gradient_leftright_png.vtex_c`,
	primary_attribute_strength: `${ImagePath}/primary_attribute_icons/primary_attribute_icon_strength_psd.vtex_c`,
	primary_attribute_agility: `${ImagePath}/primary_attribute_icons/primary_attribute_icon_agility_psd.vtex_c`,
	primary_attribute_intelligence: `${ImagePath}/primary_attribute_icons/primary_attribute_icon_intelligence_psd.vtex_c`,
	primary_attribute_all: `${ImagePath}/primary_attribute_icons/mini_primary_attribute_icon_all_psd.vtex_c`,
	icon_timer: `${reborn}/icon_attack_speed2_psd.vtex_c`,
	icon_courier: `${reborn}/icon_courier_standard_psd.vtex_c`,
	icon_sharedunit: `${reborn}/sharedunit_rest_png.vtex_c`,
	icon_combat_log: `${reborn}/icon_combat_log_psd.vtex_c`,
	empty_slot: `${reborn}/inventory_item_well_psd.vtex_c`,
	magic_resist: `${reborn}/icon_magic_resist_psd.vtex_c`,
	ult_ready_blind: `${WrapperImagePath}/panels/ult_ready_blind_psd.png`,
	arrow_gold_dif_blind: `${WrapperImagePath}/panels/arrow_gold_dif_blind_psd.png`,
	bg_deathsummary: `${WrapperImagePath}/panels/item_purchase_bg_psd.png`,
	courier_dire: `${WrapperImagePath}/couriers/dire.png`,
	courier_radiant: `${WrapperImagePath}/couriers/radiant.png`,
	icon_levelup_button_3: `${reborn}/levelup_button_3_psd.vtex_c`,
	icon_svg_creep: `${WrapperImagePath}/icons/creeps.svg`,
	icon_svg_tower: `${WrapperImagePath}/icons/towers.svg`,
	icon_svg_courier: `${WrapperImagePath}/icons/couriers.svg`,
	icon_svg_lock: `${WrapperImagePath}/icons/lock.svg`,
	icon_svg_roashan: `${WrapperImagePath}/icons/roashan.svg`,
	icon_svg_weather_effects: `${WrapperImagePath}/icons/weather_effects.svg`,
	icon_svg_health: `${WrapperImagePath}/icons/health.svg`,
	icon_svg_level: `${WrapperImagePath}/icons/level.svg`,
	icon_svg_charges: `${WrapperImagePath}/icons/charges.svg`,
	icon_svg_duration: `${WrapperImagePath}/icons/duration.svg`,
	icon_svg_hamburger: `${WrapperImagePath}/icons/hamburger.svg`,
	icon_svg_format_time: `${WrapperImagePath}/icons/format_time.svg`,
	icon_svg_fow_time: `${WrapperImagePath}/icons/fow_time.svg`,
	icon_svg_keyboard: `${WrapperImagePath}/icons/keyboard.svg`,
	icon_svg_other: `${WrapperImagePath}/icons/other.svg`,
	icon_close_cross_eye_hidden: `${WrapperImagePath}/icons/close-cross-eye-hidden.svg`,
	chat_arrow_grow: `${WrapperImagePath}/icons/chat_arrow_grow.svg`,
	chat_arrow_down: `${WrapperImagePath}/icons/chat_arrow_down.svg`,
	icon_svg_alien: `${WrapperImagePath}/icons/alien.svg`,
	icon_svg_time_fast: `${WrapperImagePath}/icons/time-fast.svg`,
	icon_svg_tree_alt: `${WrapperImagePath}/icons/tree-alt.svg`,
	icon_svg_teddy_bear: `${WrapperImagePath}/icons/teddy_bear.svg`,
	icon_analytics: `${ImagePath}/plus/achievements/view_post_game_analytics_icon_png.vtex_c`,
	icon_notification: `${WrapperMenuPath}/icons/notification.svg`
}

export function GetItemTexture(name: string): string {
	if (name === "") {
		return ""
	}
	return getTexturePath(name, true)
}

export function GetSpellTexture(name: string): string {
	if (name === "") {
		return ""
	}
	return getTexturePath(name)
}

export function GetTowerTexture(small?: boolean): string {
	return small ? Icons.icon_svg_tower : Icons.tower_radiant
}

export function GetHeroTexture(name: string, small?: boolean): string {
	if (name.length === 0) {
		return ""
	}
	return !small
		? `${HeroImagePath + "/" + name}_png.vtex_c`
		: `${HeroIconsPath + "/" + name}_png.vtex_c`
}

export function GetCourierTexture(small?: boolean, team?: Team): string {
	return small
		? Icons.icon_svg_courier
		: team === Team.Dire
			? Icons.courier_dire
			: Icons.courier_radiant
}

export function GetRuneTexture(name: string, small?: boolean): string {
	return !small ? RunePath + "/" + name + ".png" : RunePath + "/mini/" + name + ".png"
}

export function GetBearTexture(): string {
	return HeroImagePath + "/npc_dota_lone_druid_bear_png.vtex_c"
}

export function GetCreepTexture(name: string): string {
	if (name.startsWith("npc_dota_lycan_wolf")) {
		return HeroImagePath + "/npc_dota_lycan_wolf_png.vtex_c"
	}
	if (name.startsWith("npc_dota_unit_undying_zombie")) {
		return HeroImagePath + "/npc_dota_unit_undying_zombie_png.vtex_c"
	}
	if (name.startsWith("npc_dota_necronomicon_archer")) {
		return HeroImagePath + "/npc_dota_necronomicon_archer_png.vtex_c"
	}
	if (name.startsWith("npc_dota_necronomicon_warrior")) {
		return HeroImagePath + "/npc_dota_necronomicon_warrior_png.vtex_c"
	}
	return HeroImagePath + "/" + name + "_png.vtex_c"
}

export function GetUnitTexture(unitName: string, small?: boolean, team?: Team): string {
	team ??= Team.Radiant
	switch (true) {
		case unitName.includes("npc_dota_hero_"):
			return GetHeroTexture(unitName, small)
		case unitName.includes("druid_bear"):
			return GetBearTexture()
		case unitName.includes("_courier"):
			return GetCourierTexture(small, team)
		case unitName.includes("badguys_tower") || unitName.includes("goodguys_tower"):
			return GetTowerTexture(small)
		case unitName === "npc_dota_roshan":
			return Icons.roshan_halloween_angry
		case unitName.includes("psionic_trap"):
			return GetSpellTexture("templar_assassin_psionic_trap")
		default:
			return GetCreepTexture(unitName)
	}
}

export function GetRankTexture(lane: LaneSelection): string {
	switch (lane) {
		case LaneSelection.OFF_LANE:
			return Icons.offlane
		case LaneSelection.MID_LANE:
			return Icons.midlane
		case LaneSelection.SUPPORT:
			return Icons.softsupport
		case LaneSelection.HARD_SUPPORT:
			return Icons.hardsupport
		default:
			return Icons.safelane
	}
}
