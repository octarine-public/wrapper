import { GameSleeper, Hero, Utils, Vector2 } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MyHero } from "../Listeners"
import { blinkKey, active, soulTresh } from "../MenuManager"
import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"

let Sleep = new GameSleeper

export function fastBlink() {
	if (!Base.IsRestrictions(active))
		return false
	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)	
	if (!blinkKey.is_pressed|| ItemsInit.Blink==undefined || Sleep.Sleeping("blinker") || Abilities.r.IsChanneling)
		return false
	let castRange = ItemsInit.Blink.GetSpecialValue("blink_range") + MyHero.CastRangeBonus
	if (ItemsInit.Blink.CanBeCasted()) {
		if (Utils.CursorWorldVec.Distance2D(MyHero.NetworkPosition)<= castRange)
		{
			ItemsInit.Blink.UseAbility(Utils.CursorWorldVec)
		}
		else
		{
			ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(Utils.CursorWorldVec,castRange-1))
		}
	}
	else {
		if (Utils.CursorWorldVec.AngleBetweenVectors(MyHero.NetworkPosition)>30&&!Sleep.Sleeping("fastbm"))
		{
			MyHero.MoveToDirection(Utils.CursorWorldVec)
			Sleep.Sleep(40,"fastbm")
			return false
		}
		if (ItemsInit.Soulring !== undefined 
			&& ItemsInit.Soulring.CanBeCasted() 
			&& MyHero.HP / MyHero.MaxHP * 100 > soulTresh.value
			) { 
				ItemsInit.Soulring.UseAbility()
			}
		if (Abilities.r !== undefined
			&&Abilities.r.CanBeCasted()
			&&!Abilities.r.IsInAbilityPhase
			&&!ItemsInit.Blink.IsReady
			) {
				Abilities.r.UseAbility()
				Sleep.Sleep(Abilities.r.GetSpecialValue("channel_tooltip", Abilities.r.Level) * 1000+Abilities.r.CastPoint * 1000, "blinker")
				return false
		}
	}
}