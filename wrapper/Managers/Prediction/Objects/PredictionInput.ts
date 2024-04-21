import { CollisionTeam, CollisionTypes } from "../../../Enums/CollisionTypes"
import { SkillShotType } from "../../../Enums/SkillShotType"
import { Unit } from "../../../Objects/Base/Unit"

export class PredictionInput {
	public Caster!: Unit
	public Target!: Unit
	public Delay = 0
	public Radius = 0
	public Range = 0
	public Speed = 0
	public UseBlink = false
	public EndRadius = 0
	public CastRange = 0
	public AreaOfEffect = false
	public RequiresToTurn = false
	public ActivationDelay = 0
	public ExtraRangeFromCaster = 0
	public SkillShotType = SkillShotType.None
	public CollisionTeam = CollisionTeam.Enemy
	public CollisionTypes = CollisionTypes.None
	public readonly AreaOfEffectTargets: Unit[] = []
}
