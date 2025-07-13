declare interface IWrapperClassOptions {
	readonly Paths: string | string[]
	readonly Attachs: number | number[]
	readonly FindCaster?: boolean
	readonly IsAttachedTo?: boolean
	readonly IsModifiersAttachedTo?: boolean
	readonly SourceCP?: number
	readonly TargetCP?: number
}
