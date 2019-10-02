import { Base } from "./Extends/Helper"
import { cursorRadius, active, items } from "./MenuManager"
import { 
	ArrayExtensions, Creep, Entity, 
	Hero, Utils, TrackingProjectile, 
	Tree, Team, Vector3, PhysicalItem, Building, Tower
} from "wrapper/Imports"
export let Heroes: Hero[] = []
export let trees: Tree[] = []
export let creeps: Creep[] = []
export let towers: Building[] = []
export let MyHero: Hero
export let MouseTarget: Hero
export let fountain:Vector3
export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_tinker"
export let savespots: Vector3[] = [new Vector3(-1073, -6927, 384),
	new Vector3(-1100, 6951, 384),
	new Vector3(-1180, 5551, 384),
	new Vector3(-1236, -1858, 256),
	new Vector3(-1568, -3232, 256),
	new Vector3(-1568, 5536, 384),
	new Vector3(-1632, 6688, 384),
	new Vector3(-1731, 6864, 384),
	new Vector3(-177, 5156, 384),
	new Vector3(-2016, -2464, 256),
	new Vector3(-2032, -2420, 256),
	new Vector3(-2041, -936, 256),
	new Vector3(-2303, -2759, 256),
	new Vector3(-2321, 6938, 384),
	new Vector3(-2336, -4704, 256),
	new Vector3(-2394, -3110, 256),
	new Vector3(-2490, -1083, 256),
	new Vector3(-2656, -1440, 256),
	new Vector3(-2676, 5523, 384),
	new Vector3(-2696, 6878, 384),
	new Vector3(-2720, 5536, 384),
	new Vector3(-2720, 6752, 384),
	new Vector3(-2832, -1435, 256),
	new Vector3(-2947, -6995, 256),
	new Vector3(-2976, 480, 384),
	new Vector3(-3117, 6930, 384),
	new Vector3(-330, -6876, 384),
	new Vector3(-3497, 6873, 384),
	new Vector3(-3680, 6624, 384),
	new Vector3(-3737, 5550, 384),
	new Vector3(-3744, -7200, 384),
	new Vector3(-3791, 6757, 384),
	new Vector3(-3888, -2336, 256),
	new Vector3(-3936, 5536, 384),
	new Vector3(-3990, -7001, 384),
	new Vector3(-416, -7072, 384),
	new Vector3(-4234, 5335, 384),
	new Vector3(-4308, 6977, 384),
	new Vector3(-4631, 6760, 384),
	new Vector3(-4651,-2031, 384),
	new Vector3(-4832, -7072, 384),
	new Vector3(-5025, 5136, 384),
	new Vector3(-5088, -7072, 384),
	new Vector3(-5130, 6783, 384),
	new Vector3(-5152, 5088, 384),
	new Vector3(-5152, 6624, 384),
	new Vector3(-5269, 5023, 384),
	new Vector3(-530, -5611, 384),
	new Vector3(-5408, -7008, 384),
	new Vector3(-5458, 6709, 384),
	new Vector3(-5728, -6816, 384),
	new Vector3(-6041, -6883, 384),
	new Vector3(-6104, 6542, 384),
	new Vector3(-623, -6858, 384),
	new Vector3(-6273, 6178, 384),
	new Vector3(-6581, 5919, 384),
	new Vector3(-6688, 3488, 384),
	new Vector3(-6732, 5540, 384),
	new Vector3(-6752, 3616, 384),
	new Vector3(-6816, 3744, 384),
	new Vector3(-6816, 4448, 384),
	new Vector3(-6847, 3532, 384),
	new Vector3(-6880, 288, 384),
	new Vector3(-6900, 5118, 384),
	new Vector3(-6944, 1568, 384),
	new Vector3(-6994, 4915, 384),
	new Vector3(-7072, -1120, 384),
	new Vector3(-7072, -672, 384),
	new Vector3(-7114, 337, 384),
	new Vector3(-7125, -81, 384),
	new Vector3(-7129, 1337, 384),
	new Vector3(-7136, -4384, 384),
	new Vector3(-7140, 1645, 384),
	new Vector3(-7176, 2070, 384),
	new Vector3(-7194, 732, 384),
	new Vector3(-7200, -1017, 384),
	new Vector3(-7200, -288, 384),
	new Vector3(-7211, 2344, 256),
	new Vector3(-7212, -551, 384),
	new Vector3(-7226, 3989, 384),
	new Vector3(-7233, -1376, 384),
	new Vector3(-7264, -4505, 384),
	new Vector3(-7305, -5016, 384),
	new Vector3(-7328, -4768, 384),
	new Vector3(-736, 6816, 384),
	new Vector3(-7507,-3000,384),
	new Vector3(-767, 7021, 384),
	new Vector3(-7692,-3687,384),
	new Vector3(-7700,-3250,384),
	new Vector3(-7731,-2998,384),
	new Vector3(-82, 6823, 384),
	new Vector3(-907, -1464, 256),
	new Vector3(-992, 5536, 384),
	new Vector3(1008, 1594, 256),
	new Vector3(1009, 6861, 384),
	new Vector3(1150, -6852, 384),
	new Vector3(1283, 19, 256),
	new Vector3(1561, 6964, 384),
	new Vector3(1568, 3040, 384),
	new Vector3(1594, -6898, 384),
	new Vector3(1632, 6752, 256),
	new Vector3(1757,5117,256),
	new Vector3(1824, 3296, 384),
	new Vector3(183, 6728, 384),
	new Vector3(1970, -6840, 384),
	new Vector3(2228, 2684, 256),
	new Vector3(2336, -5664, 384),
	new Vector3(2336, 7136, 384),
	new Vector3(2388, -6791, 384),
	new Vector3(2400, -6817, 384),
	new Vector3(2463, -5622, 384),
	new Vector3(2464, -5728, 384),
	new Vector3(2540, 6960, 384),
	new Vector3(2696, -6795, 384),
	new Vector3(2784, 992, 256),
	new Vector3(2848, -5664, 384),
	new Vector3(289, -6964, 384),
	new Vector3(2939, 1222, 256),
	new Vector3(2962, -5598, 383),
	new Vector3(3013, -6804, 384),
	new Vector3(3024, 826,384),
	new Vector3(3040, -6624, 384),
	new Vector3(3364, -6777, 384),
	new Vector3(3445, 6863, 384),
	new Vector3(3879, -6734, 384),
	new Vector3(3951, -5522, 384),
	new Vector3(4192, -6880, 384),
	new Vector3(4192, 6944, 384),
	new Vector3(4256, -6624, 384),
	new Vector3(4333, -6725, 384),
	new Vector3(4536, -6652, 384),
	new Vector3(4623, -5468, 384),
	new Vector3(489, 1421, 256),
	new Vector3(4971, -6738, 384),
	new Vector3(4987, -5374, 384),
	new Vector3(5024, -5408, 384),
	new Vector3(5344, 2528, 384),
	new Vector3(5378, -6735, 384),
	new Vector3(5472, 6752, 384),
	new Vector3(5565, -1369, 384),
	new Vector3(5650, -6737, 384),
	new Vector3(5655, -3890, 384),
	new Vector3(5690, 995, 384),
	new Vector3(5856, -6240, 384),
	new Vector3(6021, -6588, 384),
	new Vector3(6059, -6451, 384),
	new Vector3(608, 7008, 384),
	new Vector3(6304, -6112, 384),
	new Vector3(6381, -6424, 384),
	new Vector3(6583, -6132, 384),
	new Vector3(6647, -5824, 384),
	new Vector3(6701, -5480, 384),
	new Vector3(673, 6884, 384),
	new Vector3(6816, -224, 384),
	new Vector3(6850, -193, 384),
	new Vector3(6891, -5163, 384),
	new Vector3(6898, -3549, 384),
	new Vector3(6918, -908, 384),
	new Vector3(6924, -4814, 384),
	new Vector3(6944, -5472, 384),
	new Vector3(6944, -992, 384),
	new Vector3(7029, 494, 384),
	new Vector3(7031, -3224, 384),
	new Vector3(7080, -1472, 384),
	new Vector3(7086, -37, 384),
	new Vector3(7171, -1807, 384),
	new Vector3(7200, -2272, 384),
	new Vector3(7200, -3296, 384),
	new Vector3(7200, 480, 384),
	new Vector3(7200, 5536, 384),
	new Vector3(7205, -493, 383),
	new Vector3(7226, 866, 384),
	new Vector3(7297, -2177, 384),
	new Vector3(7328, -5024, 384),
	new Vector3(736, 1056, 256),
	new Vector3(7400, 2808, 384),
	new Vector3(7456, 2090, 256),
	new Vector3(7456, 2784, 384),
	new Vector3(7460, -4648, 384),
	new Vector3(7584, 2080, 256),
	new Vector3(759, -6957, 384),
	new Vector3(928, 1248, 256),
	new Vector3(928, 1696, 256),
	new Vector3(-1056, 6752, 384)]
export let radiantSpot: Vector3[] = [new Vector3(-4620, 156, 256), new Vector3(-903, -4109, 384),	new Vector3(3670, -4655, 256), new Vector3(167, -3998, 384), new Vector3(-38,-2600, 256)]
export let radiantCast: Vector3[] = [new Vector3(-4568, 252, 256),new Vector3(-1033, -3828, 256),new Vector3(3757, -4497, 256), new Vector3(100, -3847, 384), new Vector3(1, -2447, 256)]
export let direSpot: Vector3[] = [new Vector3(3520, 155, 384), new Vector3(3377, 56, 384), new Vector3(-2406, 3738, 256),	new Vector3(474, 3788, 384), new Vector3(-992, 3061, 384), new Vector3(-1078.5,2815.9,384)]
export let direCast: Vector3[] = [new Vector3(3696, 321, 384),  new Vector3(3592, 248, 384),   new Vector3(-2409, 3863, 256), new Vector3(583, 3650, 384), new Vector3(-921, 2952, 384), new Vector3(-927, 2891, 384)]
export let 	radj:number[][] = [[1778,1284,1432,1084,1087],[1235,1087,1440,1136,1087,1383]]
let itskeet: String[] = ["item_aether_lens","item_sheepstick","item_dagon_5","item_dagon","item_dagon_2","item_dagon_3","item_dagon_4","item_shivas_guard","item_bloodthorn","item_orchid","item_rod_of_atos"]
export function InitMouse() {
	if (!Base.IsRestrictions(active))
		return false
	MouseTarget = ArrayExtensions.orderBy (
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= cursorRadius.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

export function GameEnded() {
	MyHero = undefined
	Heroes = []
}

export function GameStarted(hero: Hero) {
	if (MyHero === undefined && hero.Name === MyNameHero) {
		MyHero = hero
		fountain = (MyHero.Team!==undefined && MyHero.Team == 2)?new Vector3(-7167, - 6646, 520):new Vector3(7036, 6434, 520)
	}

}

export function EntityCreated(npc: Entity) {
	if (npc instanceof Hero && !npc.IsIllusion) {
			Heroes.push(npc)
	}
	if (npc instanceof Creep) {
		creeps.push(npc)
	}
	if (npc instanceof Tree)
	{
		trees.push(npc)	
	}
	if (npc instanceof Tower)
	{
		towers.push(npc)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero) {
		if (Heroes !== undefined || Heroes.length > 0) {
			ArrayExtensions.arrayRemove(Heroes, x)
		}
	}
	if (x instanceof Creep) {
		ArrayExtensions.arrayRemove(creeps,x)
	}
	if (x instanceof Tree)
	{
		ArrayExtensions.arrayRemove(trees,x)
	}
	if (x instanceof Tower)
	{
		ArrayExtensions.arrayRemove(towers,x)
	}
}

export function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (!Base.IsRestrictions(active)) {
		return false
	}
	let Entity = proj.Source as Entity
	if (proj instanceof TrackingProjectile 
	&& Entity instanceof Hero 
	&& !Entity.IsEnemy() && Entity.Name === MyNameHero) {
		ProjList.push(proj)
	}
}

export function LinearProjectileDestroyed(proj: TrackingProjectile){
	if (!Base.IsRestrictions(active)) {
		return false
	}
	if (ProjList !== undefined && ProjList.length > 0) {
		ArrayExtensions.arrayRemove(ProjList, proj)
	}
}