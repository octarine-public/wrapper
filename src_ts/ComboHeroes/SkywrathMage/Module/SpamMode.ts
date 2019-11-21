import { TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, MouseTarget, MyHero, initItemsMap, initAbilityMap } from "../Listeners"
import { BladeMailUseCyclone, ComboKey, SmartArcaneAutoBoltState, SmartArcaneBoltKey, SmartArcaneOwnerHP, State } from "../Menu"
let Sleep = new TickSleeper()

export function AutoUsage() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if (
		BladeMailUseCyclone.value
		&& Heroes.some(x =>
			x.IsEnemy()
			&& x.HasBuffByName("modifier_item_blade_mail_reflect")
			&& x.HasBuffByName("modifier_skywrath_mystic_flare_aura_effect")
			&& x.IsAlive && x.IsVisible && !x.IsInvulnerable
		)
	) {
		let Items = initItemsMap.get(MyHero)
		if (Items === undefined)
			return
		if (Items.Cyclone && Items.Cyclone.CanBeCasted()) {
			MyHero.CastTarget(Items.Cyclone, MyHero)
			Sleep.Sleep(Items.Tick)
			return
		}
	}

	// ArcaneBolt
	if (ComboKey.is_pressed || MouseTarget === undefined)
		return
	if (!SmartArcaneBoltKey.is_pressed && !SmartArcaneAutoBoltState.value)
		return
	let target = MouseTarget,
		Abilities = initAbilityMap.get(MyHero)
	if (Abilities.ArcaneBolt !== undefined
		&& Base.Cancel(target)
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.ArcaneBolt.CanBeCasted()) {
		if (SmartArcaneOwnerHP.value > MouseTarget.HPPercent || SmartArcaneOwnerHP.value === 0 || SmartArcaneBoltKey.is_pressed) {
			MyHero.CastTarget(Abilities.ArcaneBolt, MouseTarget)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt))
			return
		}
	}
	return
}
export function AutoModeDeleteVars() {
	Sleep.ResetTimer()
}