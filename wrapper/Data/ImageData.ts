import { LaneSelection } from "../Enums/LaneSelection"
import { Team } from "../Enums/Team"
import { AbilityData } from "../Objects/DataBook/AbilityData"

export const Paths = new (class BaseImageData {
	public readonly Images = "panorama/images"
	public readonly Hero = `${this.Images}/heroes`
	public readonly HeroIcons = `${this.Hero}/icons`

	private readonly hud = `${this.Images}/hud`
	private readonly mask = `${this.Images}/masks`
	private readonly reborn = `${this.hud}/reborn`

	public readonly Icons = {
		topbar_mana: `${this.reborn}/topbar_mana_psd.vtex_c`,
		topbar_health: `${this.reborn}/topbar_health_psd.vtex_c`,
		topbar_health_dire: `${this.reborn}/topbar_health_dire_psd.vtex_c`,
		topbar_health_colorblind: `${this.reborn}/topbar_health_colorblind_psd.vtex_c`,
		buyback_header: `${this.reborn}/buyback_header_psd.vtex_c`,
		buyback_topbar: `${this.reborn}/topbar_buyback_psd.vtex_c`,
		buyback_topbar_alive: `${this.reborn}/buyback_topbar_alive_psd.vtex_c`,
		ult_cooldown: `${this.reborn}/ult_cooldown_psd.vtex_c`,
		buff_outline: `${this.reborn}/buff_outline_psd.vtex_c`,
		ult_no_mana: `${this.reborn}/ult_no_mana_psd.vtex_c`,
		ult_ready: `${this.reborn}/ult_ready_psd.vtex_c`,
		softedge_circle_sharp: `${this.mask}/softedge_circle_sharp_png.vtex_c`,
		chat_preview_opacity_mask: `${this.mask}/chat_preview_opacity_mask_png.vtex_c`,
		arrow_gold_dif: `${this.reborn}/arrow_gold_dif_psd.vtex_c`,
		arrow_plus_stats_red: `${this.reborn}/arrow_plus_stats_red_psd.vtex_c`,
		softedge_horizontal: `${this.mask}/softedge_horizontal_png.vtex_c`,
		levelup_button_3: `${this.reborn}/levelup_button_3_psd.vtex_c`,
		levelup_button_5: `${this.reborn}/levelup_button_5_psd.vtex_c`,
		icon_damage: `${this.reborn}/icon_damage_psd.vtex_c`,
		icon_speed: `${this.reborn}/icon_speed_psd.vtex_c`,
		icon_dota_plus: `${this.Images}/plus/achievements/plus_icon_png.vtex_c`,
		icon_send_message: `${this.Images}/profile/icon_send_message_psd.vtex_c`,
		icon_scan: `${this.reborn}/icon_scan_on_psd.vtex_c`,
		icon_ward: `${this.Images}/icon_ward_psd.vtex_c`,
		icon_ward_observer: `${this.Images}/ward_observer_png.vtex_c`,
		icon_ward_sentry: `${this.Images}/items/ward_sentry_png.vtex_c`,
		icon_settings: `${this.Images}/control_icons/gear_png.vtex_c`,
		check_png: `${this.Images}/control_icons/check_png.vtex_c`,
		icon_roshan: `${this.reborn}/icon_roshan_psd.vtex_c`,
		icon_glyph_small: `${this.reborn}/icon_glyph_small_psd.vtex_c`,
		kill_mask: `${this.Images}/status_icons/modifier_kill_effect_psd.vtex_c`,
		dead_icon: `${this.reborn}/dead_icon_psd.vtex_c`,
		gold_large: `${this.reborn}/gold_large_png.vtex_c`,
		transfer_arrow_png: `${this.reborn}/toast_neutral_item_transfer_arrow_png.vtex_c`,
		tower_radiant: `${this.Images}/heroes/npc_dota_hero_tower_radiant_png.vtex_c`,
		tower_dire: `${this.Images}/heroes/npc_dota_hero_tower_dire_png.vtex_c`,
		outpost: `${this.hud}/icon_outpost_psd.vtex_c`,
		roshan_timer_roshan: `${this.reborn}/roshan_timer_roshan_psd.vtex_c`,
		outpost_lose: `${this.hud}/icon_outpost_lost_psd.vtex_c`,
		outpost_captured: `${this.hud}/icon_outpost_captured_psd.vtex_c`,
		hardsupport: `${this.Images}/rank_tier_icons/handicap/hardsupporticon_psd.vtex_c`,
		softsupport: `${this.Images}/rank_tier_icons/handicap/softsupporticon_psd.vtex_c`,
		offlane: `${this.Images}/rank_tier_icons/handicap/offlaneicon_psd.vtex_c`,
		midlane: `${this.Images}/rank_tier_icons/handicap/midlaneicon_psd.vtex_c`,
		safelane: `${this.Images}/rank_tier_icons/handicap/safelaneicon_psd.vtex_c`,
		roshan_slam: `${this.Images}/spellicons/roshan_slam_png.vtex_c`,
		roshan_bash: `${this.Images}/spellicons/roshan_bash_png.vtex_c`,
		roshans_gift: `${this.Images}/econ/tools/roshans_gift_png.vtex_c`,
		roshan_halloween_levels: `${this.Images}/spellicons/roshan_halloween_levels_png.vtex_c`,
		roshan_halloween_angry: `${this.Images}/spellicons/roshan_halloween_angry_png.vtex_c`,
		gradient_leftright: `${this.mask}/gradient_leftright_png.vtex_c`,
		primary_attribute_strength: `${this.Images}/primary_attribute_icons/primary_attribute_icon_strength_psd.vtex_c`,
		primary_attribute_agility: `${this.Images}/primary_attribute_icons/primary_attribute_icon_agility_psd.vtex_c`,
		primary_attribute_intelligence: `${this.Images}/primary_attribute_icons/primary_attribute_icon_intelligence_psd.vtex_c`,
		primary_attribute_all: `${this.Images}/primary_attribute_icons/mini_primary_attribute_icon_all_psd.vtex_c`,
		icon_timer: `${this.reborn}/icon_attack_speed2_psd.vtex_c`,
		icon_courier: `${this.reborn}/icon_courier_standard_psd.vtex_c`,
		icon_sharedunit: `${this.reborn}/sharedunit_rest_png.vtex_c`,
		icon_combat_log: `${this.reborn}/icon_combat_log_psd.vtex_c`,
		empty_slot: `${this.reborn}/inventory_item_well_psd.vtex_c`,
		magic_resist: `${this.reborn}/icon_magic_resist_psd.vtex_c`,
		// TODO: ult_ready_blind: `${this.PathFiles}/images/panels/ult_ready_blind_psd.png`,
		// TODO: arrow_gold_dif_blind: `${this.PathFiles}/images/panels/arrow_gold_dif_blind_psd.png`,
		// TODO: bg_deathsummary: `${this.PathFiles}/images/panels/item_purchase_bg_psd.png`,
		courier_dire: "images/couriers/dire.png",
		courier_radiant: "images/couriers/radiant.png"
	}
})()

const getTexturePath = (name: string): string =>
	AbilityData.GetAbilityByName(name)?.TexturePath ?? ""

export function GetItem(name: string): string {
	return getTexturePath(name)
}

export function GetSpell(name: string): string {
	return getTexturePath(name)
}

export function GetTower(): string {
	return Paths.Icons.tower_radiant
}

export function GetHero(name: string, small?: boolean): string {
	return !small
		? `${Paths.Hero + "/" + name}_png.vtex_c`
		: `${Paths.HeroIcons + "/" + name}_png.vtex_c`
}

export function GetCourier(small?: boolean, team?: Team): string {
	return small
		? Paths.Icons.icon_courier
		: team === Team.Dire
		? Paths.Icons.courier_dire
		: Paths.Icons.courier_radiant
}

// TODO: spells, items, runes
export function GetEntity(entityName: string, small?: boolean, team?: Team): string {
	team ??= Team.Radiant
	switch (true) {
		case entityName.includes("npc_dota_hero_"):
			return GetHero(entityName, small)
		case entityName.includes("_courier"):
			return GetCourier(small, team)
		case entityName.includes("badguys_tower") ||
			entityName.includes("goodguys_tower"):
			return GetTower()
		case entityName.includes("roshan"):
			return Paths.Icons.roshan_halloween_angry
		case entityName.includes("psionic_trap"):
			return GetSpell("templar_assassin_psionic_trap")
		default:
			return GetHero(entityName)
	}
}

export function GetRank(lane: LaneSelection): string {
	switch (lane) {
		case LaneSelection.OFF_LANE:
			return Paths.Icons.offlane
		case LaneSelection.MID_LANE:
			return Paths.Icons.midlane
		case LaneSelection.SUPPORT:
			return Paths.Icons.softsupport
		case LaneSelection.HARD_SUPPORT:
			return Paths.Icons.hardsupport
		default:
			return Paths.Icons.safelane
	}
}
