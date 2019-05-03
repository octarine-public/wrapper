import { MenuManager, CreateRGBATree } from "../CrutchesSDK/Wrapper";
import { arrayRemove } from "../Utils"

// --- Menu
const jungleMHMenu = new MenuManager("Jungle MapHack");
const stateMain = jungleMHMenu.AddToggle("State");

// Camp Informer
const campInformerMenu = jungleMHMenu.AddTree("Camp Informer")
	.SetToolTip("Blue - creep waiting to spawn. Green - creep already spawned");
const campInformerState = campInformerMenu.AddToggle("State")
const campInformerSize = campInformerMenu.AddSlider("Font Size", 15, 10, 50);
const campInformerAlpha = campInformerMenu.AddSlider("Font Alpha", 255, 0, 255);

// Particle Hack
const particleHackMenu = jungleMHMenu.AddTree("Particle Hack");
const particleHackState = particleHackMenu.AddToggle("State");

const phBlood = particleHackMenu.AddTree("Blood");
const phBloodState = particleHackMenu.AddToggle("State Blood");

const phBloodTimer = phBlood.AddSlider("Timer", 6, 1, 10)
	.SetToolTip("Timer before delete draw");
const phBloodColor = CreateRGBATree(phBlood, "Text color");
const phBloodSize = phBlood.AddSlider("Font Size", 20, 5, 50);

const phTechiesMine = particleHackMenu.AddTree("Techies mines");
const phTechiesMineState = phTechiesMine.AddToggle("State Techies mines");
// need auto parse data by name
//const phTechiesMineShowRange = phTechiesMine.AddToggle("Show Range");
const phTechiesMineShowTimers = phTechiesMine.AddToggle("Show Timers");

// --- Variables
let allNeutrals: C_DOTA_BaseNPC[] = [],
	allBloodTargets: C_DOTA_BaseNPC[] = [],
	allTechiesMine: TechiesMine[] = [],
	allNearTechiesMines: Array<[TechiesMine[], Vector, string]> = [];


class TechiesMine {
	
	idParticle: number
	createTime: number
	protected abilityName: string
	ParticleControl: Vector[]
	
	constructor(idParticle: number, abilityName: string) {
		this.idParticle = idParticle;
		this.abilityName = abilityName;
		this.createTime = Date.now();
		
		this.ParticleControl = [];
		
		
	}
	
	ControlPoint(num: number){
		return this.ParticleControl[num] || new Vector();
	}
	
	GetNear(): [TechiesMine[], Vector, string] | false {
		
		let pos = this.ControlPoint(1);
		
		if (pos.IsZero)
			return false;

		let countNear = allTechiesMine.filter(mineNear =>
			this.idParticle !== mineNear.idParticle 
			&& mineNear.abilityName === this.abilityName 
			&& mineNear.ControlPoint(1).DistTo2D(pos) < 100)

		countNear.push(this);
			
		let count = countNear.length;
		
		if (count > 1) {
			
			pos = countNear.reduce((pv, cv, index) => {
				let cp = cv.ControlPoint(1);
				pv.x += cp.x;
				pv.y += cp.y;
				pv.z += cp.z;
				return pv;
			}, new Vector());
			
			pos.x /= count;
			pos.y /= count;
			pos.z /= count;
		}
		
		return [countNear, pos, this.abilityName];
	}
}
	
// --- Methods

stateMain.OnActivate(() => {
	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.GetAllEntities().forEach(ent => {
		if (ent instanceof C_DOTA_BaseNPC && ent.m_bIsValid) // temp IsValid
			onNPCAdded(ent);
	})
})

function onNPCAdded(ent: C_DOTA_BaseNPC) {
	if (
		ent.m_bIsCreep
		&& !ent.m_bIsLaneCreep
		&& ent.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS
		&& ent.m_iszUnitName.startsWith("npc_dota_neutral_")
	) {
		allNeutrals.push(ent);
	}
}

//Events.addListener("onGameStarted", lp => allNeutrals = []);
Events.addListener("onGameEnded", () => allNeutrals = []);

Events.addListener("onParticleCreated", console.log);

Events.addListener("onParticleCreated", (id: number, path: string, psHandle: bigint, attach: ParticleAttachment_t, target?: C_DOTA_BaseNPC) => {

	let findPlantMine = /techies_remote_mine|techies_stasis_trap/.exec(path);

	if (findPlantMine !== null) {

		if (
			target === undefined 
			|| target.m_bIsVisible 
			|| (LocalDOTAPlayer === undefined && target.m_iTeamNum === LocalDOTAPlayer.m_iTeamNum)
		)	return;

		allTechiesMine.push(new TechiesMine(id, findPlantMine[0]));
		return;
	}
	
	let findPlantMineDetonate = /techies_remote_mines_detonate|techies_stasis_trap_explode/.exec(path);
	
	if (findPlantMineDetonate !== null)
		allTechiesMine.push(new TechiesMine(id, findPlantMine[0]));
		
});
Events.addListener("onParticleUpdated", console.log);
Events.addListener("onParticleUpdated", (id: number, control_point: number, vec: Vector) => {
	
	allTechiesMine.some(({ idParticle, ParticleControl }, index) => {
		
		let some = false;
		
		if (ParticleControl[1] !== undefined && Number.isNaN(ParticleControl[1].DistTo2D(vec))) {
			allTechiesMine.splice(index, 1);
			some = true;
		}
		else if (idParticle === id) {
			ParticleControl[control_point] = vec;
			some = true;
		}
		
		if (some) {
			GroupNearMine();
			return true;
		}
		
		return false;
	});
	
});

Events.addListener("onNPCCreated", onNPCAdded);

//Events.addListener("onEntityCreated", console.log);

Events.addListener("onEntityDestroyed", (ent: C_BaseEntity) => {
	if (ent instanceof C_DOTA_BaseNPC)
		arrayRemove(allNeutrals, ent);
});

Events.addListener("onBloodImpact", (target: C_BaseEntity) => {
	if (!stateMain.value || !phBloodState.value)
		return;

	if (target === undefined || target.m_bIsVisible)
		return;

	if (allBloodTargets.includes(target as C_DOTA_BaseNPC))
		return;

	allBloodTargets.push(target as C_DOTA_BaseNPC);

	setTimeout(phBloodTimer.value * 1000, () =>
		arrayRemove(allBloodTargets, target));
});

Events.addListener("onDraw", () => {
	if (!stateMain.value)
		return;

	if (campInformerState.value) {

		allNeutrals.forEach(creep => {
			
			let isWaitSpawn = creep.m_bIsWaitingToSpawn;

			if ((!isWaitSpawn && creep.m_bIsVisible))
				return;

			let wts = Renderer.WorldToScreen(creep.m_vecNetworkOrigin);

			if (wts.IsValid) {

				let name = creep.m_iszUnitName
					.replace("npc_dota_neutral_", "")
					.split("_")
					.join(" ");

				Renderer.Text(wts.x, wts.y, name, 0,
					isWaitSpawn ? 0 : 255,
					isWaitSpawn ? 255 : 0,
					campInformerAlpha.value,
					"Arial", campInformerSize.value, 200);
			}
		});
	}

	if (particleHackState.value) {

		if (phBloodState.value) {

			allBloodTargets.forEach(target => {

				let pos = target.m_vecNetworkOrigin;

				if (pos.IsZero)
					return;

				let wts = Renderer.WorldToScreen(pos);

				if (wts.IsValid) {
					Renderer.Text(wts.x, wts.y, target.m_iszUnitName,
						phBloodColor.R.value,
						phBloodColor.G.value,
						phBloodColor.B.value,
						phBloodColor.A.value,
						"Arial", phBloodSize.value);
				}
			});
		}
		
		if (phTechiesMineState.value) {
			
			allNearTechiesMines.forEach(([allMines, pos, name]) => {
				
				let wts = Renderer.WorldToScreen(pos);

				if (wts.IsValid) {
					
					Renderer.Image(`~/other/npc_dota_${name}.png`, wts.x - 64 / 4, wts.y - 87 / 4, 64 / 2, 87 / 2);
					
					Renderer.Text(wts.x + (64 / 4), wts.y, "x" + allMines.length,
						phBloodColor.R.value,
						phBloodColor.G.value,
						phBloodColor.B.value,
						phBloodColor.A.value,
						"Arial", phBloodSize.value);
				}
			});		
		}
	}

});

Events.addListener("onTick", () => {
	if (!stateMain.value)
		return;

	if (campInformerState.value) {

		allNeutrals = allNeutrals.filter(creep =>
			creep.m_bIsValid && creep.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS);
	}
});

function GroupNearMine() {
	
	let unique: Array<[TechiesMine[], Vector, string]> = [];
	
	allTechiesMine.forEach(mine => {

		if (unique.some(mineUQ => mineUQ[0].some(mineUQID => mineUQID.idParticle === mine.idParticle)))
			return;
		
		let mines = mine.GetNear();

		if (!mines)
			return;
			
		unique.push(mines);
	});
	
	allNearTechiesMines = unique;
}

// [[], []]