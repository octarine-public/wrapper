import { Unit } from "wrapper/Imports"
import { XAIOCollisionTypes, XAIOSkillshotType } from "./Enum"

export default class XAIOInput {
	constructor(
		public Target: Unit,
		public Caster: Unit,
		public Delay: number,
		public Radius: number,
		public CollisionTypes: XAIOCollisionTypes,
		public Range: number,
		public RequiresToTurn: boolean,
		public SkillShotType: XAIOSkillshotType,
		public Speed: number,
		public UseBlink: boolean,
		public AreaOfEffect: boolean = false,
		public AreaOfEffectTargets: Unit[] = [],
	) { }
}
