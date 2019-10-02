import { Ability, Creep, ExecuteOrder, Hero, LocalPlayer,  PhysicalItem } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, MyHero } from "../Listeners"
import { rocketrearmFailsw, autoSoul, active, soulTresh, spamKey } from "../MenuManager"
import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
export function OnExecuteOrder(order: ExecuteOrder): boolean {
	
	if (!Base.IsRestrictions(active) || !rocketrearmFailsw.value || !autoSoul.value) {
		console.log("order")
		return true
	}
	if (Base.GetPermitPressing) {
		return false
	}
	let tinker = LocalPlayer
	if (tinker !== undefined) {
		if (order.Unit === LocalPlayer.Hero) {
			if (order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET) {
				let Ability = order.Ability as Ability,
					Abilities = new InitAbility(MyHero),
					ItemsInit = new InitItems(MyHero)
				if (Ability !== undefined && Ability.Name === Abilities.w.Name) {
					let _h: Hero = Heroes.find(hero => (hero.IsEnemy() &&hero.Distance2D(MyHero, true) <= 2500 + MyHero.CastRangeBonus && hero.IsVisible && !hero.IsMagicImmune))
					if (_h === undefined || spamKey.is_pressed) {
						return false
					}
				}
				if (Ability !== undefined && Ability.Name === Abilities.r.Name) {
					let dy = false
					if (MyHero.Items.some(e => e && !e.IsReady && e.Name != "item_bottle") || !Abilities.q.IsReady || !Abilities.w.IsReady || !Abilities.e.IsReady) dy = true
					if (rocketrearmFailsw && (dy === false||Abilities.r.IsChanneling)) {
						return false
					}
					if (ItemsInit.Soulring !== undefined
						&& autoSoul.value
						&& ItemsInit.Soulring.IsReady
						&& MyHero.HP / MyHero.MaxHP * 100 > soulTresh.value
						) {
							ItemsInit.Soulring.UseAbility()
							Abilities.r.UseAbility()
							return false
						}
				}

			}
		}
	}
	return true
}