import {
	ArrayExtensions,
	ParticlesSDK,
	EventsSDK,
	Game,
	Hero,
	Vector2,
	Vector3,
	Entity,
	Unit,
	RendererSDK,
	Color,
} from "wrapper/Imports"

//font = Renderer.LoadFont("Tahoma", 22, Enum.FontWeight.EXTRABOLD)

let wardCaptureTiming = 0;
let wardDrawingRemove = 0;

let wardDispenserCount = [];
let wardProcessingTable = [];

let heroes: Hero[] = [];

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Hero &&
		!ent.IsIllusion &&
		ent.IsEnemy()
	) {
		heroes.push(ent);
	}
});

EventsSDK.on("EntityDestroyed", (ent) => {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent);
	}

	//if (ent.Name == "npc_dota_sentry_wards" ||
	//ent.Name == "npc_dota_observer_wards") {

	if (ent.Name == "npc_dota_ward_base" ||
		ent.Name == "npc_dota_ward_base_truesight") {

		wardProcessingTable = wardProcessingTable.filter((w) => (w != undefined));

		wardProcessingTable.forEach((ward, i) => {
			if (ward.unit.Position.Subtract(ent.Position).Length < 500) {
				wardProcessingTable.splice(i, 1);
			}
		});
	}
});

function PingEnemyWard(pos: Vector3, hero: Entity) {

	let map_ping = ParticlesSDK.Create(
		"particles/ui_mouseactions/ping_enemyward.vpcf",
		ParticleAttachment_t.PATTACH_WORLDORIGIN,
		hero
	);

	ParticlesSDK.SetControlPoint(map_ping, 0, pos);
	ParticlesSDK.SetControlPoint(map_ping, 1, new Vector3(1, 1, 1));
	ParticlesSDK.SetControlPoint(map_ping, 5, new Vector3(10, 0, 0));

	SendToConsole("play sounds/ui/ping_warning");
}

EventsSDK.on("Update", () => {
	wardProcessingTable = wardProcessingTable.filter((l) => (l !== undefined && l.dieTime > Game.GameTime));

	if (Game.GameTime - wardCaptureTiming < 0.1) {
		return;
	}

	heroes.forEach(hero => {
		if (hero.IsAlive && !hero.IsDormant) {
			let sentry = hero.GetItemByName("item_ward_sentry");
			let observer = hero.GetItemByName("item_ward_observer");
			let dispenser = hero.GetItemByName("item_ward_dispenser");

			let sentry_stack = 0;
			let observer_stack = 0;
			let owner_idx = hero.Index;

			if (sentry !== undefined) {
				sentry_stack = sentry.CurrentCharges;
			}
			else if (observer !== undefined) {
				observer_stack = observer.CurrentCharges;
			}
			else if (dispenser !== undefined) {
				sentry_stack = dispenser.SecondaryCharges;
				observer_stack = dispenser.CurrentCharges;
			}

			if (sentry_stack == 0 && observer_stack == 0) {
				if (wardDispenserCount[owner_idx] == undefined) {
					wardCaptureTiming = Game.GameTime;
				}
				else {
					let ward_type = undefined;

					if (wardDispenserCount[owner_idx].sentry > sentry_stack) {
						ward_type = "sentry";
					}
					else if (wardDispenserCount[owner_idx].observer > sentry_stack) {
						ward_type = "observer";
					}

					if (ward_type != undefined) {

						wardProcessingTable[owner_idx + Math.floor(Game.GameTime)] = {
							"type": ward_type,
							"pos": hero.Position,
							"dieTime": Math.floor(Game.GameTime + 360),
							"unit": hero
						};

						PingEnemyWard(hero.Position, hero);

						wardDispenserCount[owner_idx] = undefined;
						wardCaptureTiming = Game.GameTime;
					}
				}
			}

			if (wardDispenserCount[owner_idx] == undefined) {
				if (sentry_stack > 0 || observer_stack > 0) {
					wardDispenserCount[owner_idx] =
						{
							"sentry": sentry_stack,
							"observer": observer_stack
						};

					wardCaptureTiming = Game.GameTime;
				}
			}
			else {
				if (
					wardDispenserCount[owner_idx]["sentry"] < sentry_stack ||
					wardDispenserCount[owner_idx]["observer"] < observer_stack
				) {
					wardDispenserCount[owner_idx] =
						{
							"sentry": sentry_stack,
							"observer": observer_stack
						};

					wardCaptureTiming = Game.GameTime;
				}
				else if (wardDispenserCount[owner_idx]["sentry"] > sentry_stack) {
					wardProcessingTable[owner_idx + Math.floor(Game.GameTime)] =
						{
							"type": "sentry",
							"pos": hero.Position,
							"dieTime": Math.floor(Game.GameTime + 360),
							"unit": hero
						};

					PingEnemyWard(hero.Position, hero);

					wardDispenserCount[owner_idx] =
						{
							"sentry": sentry_stack,
							"observer": observer_stack
						};
					wardCaptureTiming = Game.GameTime;
				}
				else if (wardDispenserCount[owner_idx]["observer"] > observer_stack) {
					wardProcessingTable[owner_idx + Math.floor(Game.GameTime)] =
						{
							"type": "observer",
							"pos": hero.Position,
							"dieTime": Math.floor(Game.GameTime + 360),
							"unit": hero
						};

					PingEnemyWard(hero.Position, hero);

					wardDispenserCount[owner_idx] =
						{
							"sentry": sentry_stack,
							"observer": observer_stack
						};

					wardCaptureTiming = Game.GameTime;
				}
			}
		}
		else if (hero !== undefined && hero.IsDormant) {
			wardDispenserCount[hero.Index] = undefined;
			wardCaptureTiming = Game.GameTime;
		}
	});
});

EventsSDK.on("Draw", () => {

	wardProcessingTable.forEach((v, i) => {

		if (v !== undefined) {
			if (v.dieTime < Game.GameTime) {
				wardProcessingTable.splice(i, 1);
				return;
			}

			let type = v.type;
			let screen_pos = RendererSDK.WorldToScreen(v.pos);

			if (screen_pos !== undefined) {
				RendererSDK.Image(
					"panorama\\images\\icon_ward_psd.vtex_c",
					new Vector2(
						screen_pos.x - 15,
						screen_pos.y - 15
					),
					new Vector2(30, 30),
					(type == "sentry" ?
						new Color(15, 0, 221) :
						new Color(222, 170, 0)) //observer
				);

				let seconds = Math.floor(v.dieTime - Game.GameTime);

				RendererSDK.Text(
					Math.floor(seconds / 60) + ":" + (seconds < 10 ? " " : "") + seconds % 60,
					new Vector2(
						screen_pos.x - 15,
						screen_pos.y + 15
					)
				);
			}
		}
	});
});
