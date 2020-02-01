import { Vector3, Unit } from "wrapper/Imports"
import { XAIOHitChance } from "../bootstrap"

export default class XAIOutput {
	constructor(
		public Target?: Unit,
		public CastPosition: Vector3 = new Vector3,
		public TargetPosition: Vector3 = new Vector3,
		public HitChance: XAIOHitChance = XAIOHitChance.Impossible,
		public BlinkLinePosition: Vector3 = new Vector3,
		public AoeTargetsHit: Array<XAIOutput> = []
	) { }
}
