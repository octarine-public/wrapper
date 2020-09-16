import EntityManager from "../Managers/EntityManager"
import Hero from "../Objects/Base/Hero"
import Unit from "../Objects/Base/Unit"
import { PredictionSkillshotType } from "./PredictionSkillshotType"

export class PredictionInput {
	constructor(
		public Owner: Unit,
		private Target_: Unit,
		public Delay = 0,
		public Speed = Number.MAX_VALUE,
		public Range = Number.MAX_VALUE,
		public Radius = 0,
		public SkillshotType = PredictionSkillshotType.SkillshotLine,
		public AreaOfEffect = false,
		public AreaOfEffectTargets: Unit[] = [],
		public AreaOfEffectHitMainTarget = true,
	) {
		if (AreaOfEffect && AreaOfEffectTargets.length === 0)
			AreaOfEffectTargets = EntityManager.GetEntitiesByClass(Hero).filter(hero => hero.IsEnemy(Target_) && hero.IsInRange(Target_, Range + (Radius / 2)))
	}

	public get Target() {
		return this.Target_
	}
	public WithTarget(target: Unit): PredictionInput {
		return new PredictionInput(
			this.Owner,
			target,
			this.Delay,
			this.Speed,
			this.Range,
			this.Radius,
			this.SkillshotType,
			this.AreaOfEffect,
			this.AreaOfEffectTargets,
			this.AreaOfEffectHitMainTarget,
		)
	}
}
