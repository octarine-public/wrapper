import { LaneSelection } from "../Enums/LaneSelection"
import { Team } from "../Enums/Team"
import { AbilityData } from "../Objects/DataBook/AbilityData"

export const Paths = new (class BaseImageData {
	public readonly Wrapper = "github.com/octarine-public/wrapper"
	public readonly WrapperImages = `${this.Wrapper}/scripts_files/images`

	public readonly Runes = `${this.WrapperImages}/runes`

	public readonly Images = "panorama/images"
	public readonly Hero = `${this.Images}/heroes`
	public readonly HeroIcons = `${this.Hero}/icons`

	public readonly ItemIcons = `${this.Images}/items`
	public readonly AbilityIcons = `${this.Images}/spellicons`

	private readonly hud = `${this.Images}/hud`
	private readonly mask = `${this.Images}/masks`
	private readonly reborn = `${this.hud}/reborn`

	public readonly Icons = {
		topbar_mana: `${this.reborn}/topbar_mana_psd.vtex_c`,
		invoker_cataclysm: `${this.AbilityIcons}/invoker/magus_apex/invoker_sun_strike_png.vtex_c`,
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
		icon_brackets: `${this.Images}/control_icons/brackets_png.vtex_c`,
		icon_roshan: `${this.hud}/icon_roshan_psd.vtex_c`,
		icon_glyph_small: `${this.hud}/icon_glyph_small_psd.vtex_c`,
		icon_scan_on: `${this.reborn}/icon_scan_on_psd.vtex_c`,
		icon_glyph_on: `${this.reborn}/icon_glyph_on_psd.vtex_c`,
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
		ult_ready_blind: `${this.WrapperImages}/panels/ult_ready_blind_psd.png`,
		arrow_gold_dif_blind: `${this.WrapperImages}/panels/arrow_gold_dif_blind_psd.png`,
		bg_deathsummary: `${this.WrapperImages}/panels/item_purchase_bg_psd.png`,
		courier_dire: `${this.WrapperImages}/couriers/dire.png`,
		courier_radiant: `${this.WrapperImages}/couriers/radiant.png`,
		icon_levelup_button_3: `${this.reborn}/levelup_button_3_psd.vtex_c`,
		icon_svg_creep: `${this.WrapperImages}/icons/creeps.svg`,
		icon_svg_tower: `${this.WrapperImages}/icons/towers.svg`,
		icon_svg_courier: `${this.WrapperImages}/icons/couriers.svg`,
		icon_svg_lock: `${this.WrapperImages}/icons/lock.svg`,
		icon_svg_roashan: `${this.WrapperImages}/icons/roashan.svg`,
		icon_svg_weather_effects: `${this.WrapperImages}/icons/weather_effects.svg`,
		icon_svg_health: `${this.WrapperImages}/icons/health.svg`,
		icon_svg_level: `${this.WrapperImages}/icons/level.svg`,
		icon_svg_charges: `${this.WrapperImages}/icons/charges.svg`,
		icon_svg_duration: `${this.WrapperImages}/icons/duration.svg`,
		icon_svg_hamburger: `${this.WrapperImages}/icons/hamburger.svg`,
		icon_svg_format_time: `${this.WrapperImages}/icons/format_time.svg`,
		icon_svg_fow_time: `${this.WrapperImages}/icons/fow_time.svg`,
		icon_svg_keyboard: `${this.WrapperImages}/icons/keyboard.svg`,
		icon_svg_other: `${this.WrapperImages}/icons/other.svg`,
		icon_close_cross_eye_hidden: `${this.WrapperImages}/icons/close-cross-eye-hidden.svg`,
		chat_arrow_grow: `${this.WrapperImages}/icons/chat_arrow_grow.svg`,
		chat_arrow_down: `${this.WrapperImages}/icons/chat_arrow_down.svg`,
		icon_svg_alien: `${this.WrapperImages}/icons/alien.svg`,
		icon_svg_time_fast: `${this.WrapperImages}/icons/time-fast.svg`,
		icon_svg_tree_alt: `${this.WrapperImages}/icons/tree-alt.svg`,
		icon_svg_teddy_bear: `${this.WrapperImages}/icons/teddy_bear.svg`,
		icon_analytics: `${this.Images}/plus/achievements/view_post_game_analytics_icon_png.vtex_c`
	}
})()

const getTexturePath = (name: string, isItem = false): string => {
	const abilityData = AbilityData.GetAbilityByName(name)
	if (abilityData !== undefined && abilityData.TexturePath.length !== 0) {
		return abilityData.TexturePath
	}
	if (!isItem) {
		switch (name) {
			case "invoker_cataclysm":
				return Paths.Icons.invoker_cataclysm
			default:
				return Paths.AbilityIcons + "/" + name + "_png.vtex_c"
		}
	}
	name = !name.includes("recipe_")
		? name.replace("item_", "")
		: name.replace("item_", "recipe_")
	return Paths.ItemIcons + "/" + name + "_png.vtex_c"
}

export function GetItemTexture(name: string): string {
	return getTexturePath(name, true)
}

export function GetSpellTexture(name: string): string {
	return getTexturePath(name)
}

export function GetTowerTexture(small?: boolean): string {
	return small ? Paths.Icons.icon_svg_tower : Paths.Icons.tower_radiant
}

export function GetHeroTexture(name: string, small?: boolean): string {
	return !small
		? `${Paths.Hero + "/" + name}_png.vtex_c`
		: `${Paths.HeroIcons + "/" + name}_png.vtex_c`
}

export function GetCourierTexture(small?: boolean, team?: Team): string {
	return small
		? Paths.Icons.icon_svg_courier
		: team === Team.Dire
			? Paths.Icons.courier_dire
			: Paths.Icons.courier_radiant
}

export function GetRuneTexture(name: string, small?: boolean): string {
	return !small
		? Paths.Runes + "/" + name + ".png"
		: Paths.Runes + "/mini/" + name + ".png"
}

export function GetBearTexture(): string {
	return Paths.Hero + "/npc_dota_lone_druid_bear_png.vtex_c"
}

export function GetUnitTexture(
	unitName: string,
	small?: boolean,
	team?: Team
): Nullable<string> {
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
		case unitName.includes("roshan"):
			return Paths.Icons.roshan_halloween_angry
		case unitName.includes("psionic_trap"):
			return GetSpellTexture("templar_assassin_psionic_trap")
	}
}

export function GetRankTexture(lane: LaneSelection): string {
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
