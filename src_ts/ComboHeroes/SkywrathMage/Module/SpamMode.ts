import { TickSleeper } from "wrapper/Imports"
import InitAbility from "../Extends/Abilities"
import { Base } from "../Extends/Helper"
import InitItems from "../Extends/Items"
import { Heroes, MouseTarget, MyHero } from "../Listeners"
import { BladeMailUseCyclone, ComboKey, SmartArcaneAutoBoltState, SmartArcaneBoltKey, SmartArcaneOwnerHP, State } from "../Menu"
let Sleep = new TickSleeper()

export function AutoUsage() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return false
	if (BladeMailUseCyclone.value) {
		Heroes.filter(x => x.IsEnemy() && x.IsValid && x.IsAlive && x.IsVisible && !x.IsInvulnerable
			&& x.HasModifier("modifier_item_blade_mail_reflect")
			&& x.HasModifier("modifier_skywrath_mystic_flare_aura_effect")).some(target => {
				let Items = new InitItems(MyHero)
				if (Items.Cyclone !== undefined
					&& Items.Cyclone.CanBeCasted()) {
					MyHero.CastTarget(Items.Cyclone, MyHero)
					Sleep.Sleep(Items.Tick)
					return true
				}
				return false
			})
	}

	// ArcaneBolt
	if (ComboKey.is_pressed || MouseTarget === undefined)
		return false
	if (!SmartArcaneBoltKey.is_pressed && !SmartArcaneAutoBoltState.value)
		return false
	let target = MouseTarget,
		Abilities = new InitAbility(MyHero)
	if (Abilities.ArcaneBolt !== undefined
		&& Base.Cancel(target)
		&& !Base.CancelAbilityRealm(target)
		&& Abilities.ArcaneBolt.CanBeCasted()) {
		if (SmartArcaneOwnerHP.value > MouseTarget.HPPercent || SmartArcaneOwnerHP.value === 0 || SmartArcaneBoltKey.is_pressed) {
			MyHero.CastTarget(Abilities.ArcaneBolt, MouseTarget)
			Sleep.Sleep(Abilities.CastDelay(Abilities.ArcaneBolt))
			return true
		}
	}
	return false
}
export function AutoModeDeleteVars() {
	Sleep.ResetTimer()
}