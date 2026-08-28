class CHostLatency {
	public WindowAvg = 0
	public WindowMax = 0
	public WindowSamples = 0
	public WindowEntities = 0

	private sampleCount = 0
	private sampleSum = 0
	private sampleMax = 0
	private entitySum = 0
	private windowStartedAt = 0

	constructor(public readonly Name: string) {}

	public Sample(packedAt: Nullable<number>, entities: number): void {
		if (packedAt === undefined || packedAt <= 0) {
			return
		}
		this.Add(hrtime() - packedAt, entities)
	}

	public Add(delta: number, entities: number): void {
		const now = hrtime()
		if (this.sampleCount === 0) {
			this.windowStartedAt = now
		}
		this.sampleCount++
		this.sampleSum += delta
		this.sampleMax = Math.max(this.sampleMax, delta)
		this.entitySum += entities
		if (now - this.windowStartedAt < 1000) {
			return
		}
		this.WindowAvg = this.sampleSum / this.sampleCount
		this.WindowMax = this.sampleMax
		this.WindowSamples = this.sampleCount
		this.WindowEntities = Math.round(this.entitySum / this.sampleCount)
		this.sampleCount = 0
		this.sampleSum = 0
		this.sampleMax = 0
		this.entitySum = 0
	}
}

// mutable holder so the internal settings menu can toggle the overlay at runtime
export const HostLatencyPanel = { IsEnabled: true }

export const NativePropsLatency = new CHostLatency("native props")
export const CppParseStats = new CHostLatency("c++ parse")
export const QueueWaitStats = new CHostLatency("queue wait")
export const JsDecodeStats = new CHostLatency("js decode")
export const FieldHandlersStats = new CHostLatency("field handlers")
export const PostEventsStats = new CHostLatency("post events")
export const VisualDataLatency = new CHostLatency("visual data")
export const VisualApplyStats = new CHostLatency("visual apply")
export const HostLatencyMeters = [
	NativePropsLatency,
	CppParseStats,
	QueueWaitStats,
	JsDecodeStats,
	FieldHandlersStats,
	PostEventsStats,
	VisualDataLatency,
	VisualApplyStats
]
