import { Unit } from "../../Objects/Base/Unit"

export class EvasionDetector {
	private static readonly escapeAbilityNames = new Set([
		"puck_phase_shift",
		"storm_spirit_ball_lightning",
		"void_spirit_astral_step",
		"void_spirit_dissimilate",
		"ember_spirit_sleight_of_fist",
		"ember_spirit_activate_fire_remnant",
		"faceless_void_time_walk",
		"phantom_lancer_doppelwalk",
		"juggernaut_blade_fury",
		"lifestealer_infest",
		"slark_dark_pact",
		"slark_depth_shroud",
		"weaver_shukuchi",
		"nyx_assassin_spiked_carapace",
		"riki_tricks_of_the_trade",
		"mirana_leap"
	])

	private static readonly escapeItemNames = new Set([
		"item_blink",
		"item_overwhelming_blink",
		"item_swift_blink",
		"item_arcane_blink",
		"item_manta",
		"item_sphere",
		"item_aeon_disk",
		"item_wind_waker",
		"item_ethereal_blade"
	])

	public static HasEvasionAvailable(unit: Unit): boolean {
		return this.GetEvasionFactor(unit) > 0
	}

	public static GetEvasionFactor(unit: Unit): number {
		let factor = 0
		const spells = unit.Spells
		for (let i = 0, len = spells.length; i < len; i++) {
			const spell = spells[i]
			if (spell === undefined || spell.Level === 0) {
				continue
			}
			if (!this.escapeAbilityNames.has(spell.Name)) {
				continue
			}
			if (spell.IsCooldownReady) {
				factor += 0.5
				break
			}
		}
		const items = unit.TotalItems
		for (let i = 0, len = items.length; i < len; i++) {
			const item = items[i]
			if (item === undefined) {
				continue
			}
			if (!this.escapeItemNames.has(item.Name)) {
				continue
			}
			if (item.IsCooldownReady) {
				factor += 0.5
				break
			}
		}
		return Math.min(factor, 1)
	}
}
