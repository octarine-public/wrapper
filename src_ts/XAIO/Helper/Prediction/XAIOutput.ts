import { Vector3, Unit } from "wrapper/Imports"
import { XAIOHitChance } from "./Enum"

export default class XAIOutput {
	constructor(
		public BlinkLinePosition: Vector3 = new Vector3,
		public CastPosition: Vector3 = new Vector3,
		public HitChance: XAIOHitChance = XAIOHitChance.Impossible,
		public Target?: Nullable<Unit>,
		public TargetPosition: Vector3 = new Vector3,
		public AoeTargetsHit: Array<XAIOutput> = [],
	) { }
}
