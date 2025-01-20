declare interface IChannel {
	readonly ChannelModifierName: string
	IsChannel(): this is IChannel
}
