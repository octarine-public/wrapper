type Listener = (...args: any[]) => void;
interface IEvents { [event: string]: Listener[]; }

export class EventEmitter {
	private readonly events: IEvents = {};

	/* public preCacheEventName(args: string[]) {
		args.forEach(arg => this.events[arg] = []);
	} */
	
	public on(event: string, listener: Listener): () => void {
		if (typeof this.events[event] !== "object") {
			this.events[event] = [];
		}

		this.events[event].push(listener);
		return () => this.removeListener(event, listener);
	}

	public removeListener(event: string, listener: Listener): void {
		if (typeof this.events[event] !== "object") {
			return;
		}

		const idx = this.events[event].indexOf(listener);
		if (idx > -1) {
			this.events[event].splice(idx, 1);
		}
	}

	public removeAllListeners(): void {
		Object.keys(this.events).forEach((event: string) =>
			this.events[event].splice(0, this.events[event].length),
		);
	}

	public emit(event: string, ...args: any[]): void {
		if (typeof this.events[event] !== "object") {
			return;
		}

		this.events[event].forEach((listener) => listener.apply(this, args));
	}

	public once(event: string, listener: Listener): () => void {
		const remove = this.on(event, (...args: any[]) => {
			remove();
			listener(...args);
		});

		return remove;
	}
}

const events = new EventEmitter();

const setFireEvent = (name: string, ...args: any) => events.on(name, ...args);

global.Events = events;

/* 
Event.preCacheEventName([
	"onDraw",
	"onTick",
	"onUpdate",
	"onSendMove",
	"onUnitStateChanged",
	"onTeamVisibilityChanged",
	"onUnitAnimation",
	"onUnitAnimationEnded",
	"onTrackingProjectileCreated",
	"onTrackingProjectileUpdated",
	"onTrackingProjectileDestroyed",
	"onLinearProjectileCreated",
	"onLinearProjectileDestroyed",
	"onParticleCreated",
	"onParticleUpdated",
	"onParticleUpdatedEntity",
	"onParticleDestroyed",
	"onEntityCreated",
	"onEntityDestroyed",
	"onPrepareUnitOrders",
	"onGameStarted",
	"onGameEnded",
	"onWndProc",
])
 */



