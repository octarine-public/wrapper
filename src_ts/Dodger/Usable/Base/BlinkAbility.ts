import { Ability, Unit, Game } from "wrapper/Imports";

// class {
// 	public GetRequiredTime(EvadableAbility: Ability, unit: Unit, remainingTime: number)
// 	{
// 		var delay = CastPoint + Game.Ping / 1000;
// 		var requiredTime = Hero.GetTurnTime(unit.NetworkPosition) * 1.35 + delay + 0.1;

// 		if (remainingTime - requiredTime > 0) {
// 			BlinkPosition = unit.Position;
// 			return requiredTime;
// 		}

// 		var left = remainingTime - delay;
// 		if (left < 0) {
// 			return 111;
// 		}

// 		BlinkPosition = Hero.GetBlinkPosition(unit.Position, left - 0.15);

// 		return Hero.GetTurnTime(BlinkPosition) + delay + 0.1;
// 	}
// }