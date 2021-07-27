import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import GUIInfo from "./GUIInfo"

export default class CShop {
	public readonly CourierGold = new Rectangle()
	public readonly ShopButton = new Rectangle()
	public readonly Quickbuy_1Row = new Rectangle()
	public readonly Quickbuy_2Rows = new Rectangle()
	public readonly Sticky_1Row = new Rectangle()
	public readonly Sticky_2Rows = new Rectangle()
	public readonly ClearQuickBuy_1Row = new Rectangle()
	public readonly ClearQuickBuy_2Rows = new Rectangle()
	public readonly Stash = new Rectangle()
	public readonly StashSlots: Rectangle[] = []
	public readonly StashGrabAll = new Rectangle()

	constructor(screen_size: Vector2, hud_flipped: boolean) {
		this.CalculateCourierGold(screen_size, hud_flipped)
		this.CalculateQuickbuyAndSticky(screen_size, hud_flipped)
		this.CalculateStash(screen_size, hud_flipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.CourierGold.pos1, this.CourierGold.Size, Color.Blue.SetA(128))
		RendererSDK.FilledRect(this.ShopButton.pos1, this.ShopButton.Size, Color.Yellow.SetA(128))

		RendererSDK.FilledRect(this.Sticky_1Row.pos1, this.Sticky_1Row.Size, Color.Aqua.SetA(128))
		RendererSDK.FilledRect(this.Quickbuy_1Row.pos1, this.Quickbuy_1Row.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.ClearQuickBuy_1Row.pos1, this.ClearQuickBuy_1Row.Size, Color.Red.SetA(128))

		RendererSDK.FilledRect(this.Stash.pos1, this.Stash.Size, Color.Gray.SetA(128))
		RendererSDK.FilledRect(this.StashGrabAll.pos1, this.StashGrabAll.Size, Color.Red.SetA(128))

		this.StashSlots.forEach(rect => RendererSDK.FilledRect(
			rect.pos1,
			rect.Size,
			Color.Fuchsia.SetA(128),
		))
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateCourierGold(screen_size: Vector2, hud_flip: boolean): void {
		this.CourierGold.Width = GUIInfo.ScaleWidth(278, screen_size)
		this.CourierGold.Height = GUIInfo.ScaleHeight(60, screen_size)
		this.CourierGold.x = !hud_flip
			? screen_size.x - this.CourierGold.Width
			: 0
		this.CourierGold.y = screen_size.y - this.CourierGold.Height

		this.ShopButton.Width = GUIInfo.ScaleWidth(100, screen_size)
		this.ShopButton.Height = GUIInfo.ScaleHeight(36, screen_size)

		this.ShopButton.x = this.CourierGold.x + GUIInfo.ScaleWidth(8 + (!hud_flip ? 20 : 0), screen_size)
		this.ShopButton.y = this.CourierGold.y + GUIInfo.ScaleHeight(12, screen_size)
	}
	private CalculateQuickbuyAndSticky(screen_size: Vector2, hud_flip: boolean): void {
		this.ClearQuickBuy_1Row.Width = this.ClearQuickBuy_2Rows.Width = GUIInfo.ScaleWidth(16, screen_size)
		this.ClearQuickBuy_1Row.Height = this.ClearQuickBuy_2Rows.Height = GUIInfo.ScaleHeight(16, screen_size)

		this.Quickbuy_1Row.Width = this.Quickbuy_2Rows.Width = GUIInfo.ScaleWidth(202, screen_size)
		this.Quickbuy_1Row.Height = GUIInfo.ScaleHeight(40, screen_size)
		this.Quickbuy_2Rows.Height = GUIInfo.ScaleHeight(74, screen_size)
		this.Quickbuy_1Row.y = this.CourierGold.y - this.Quickbuy_1Row.Height
		this.Quickbuy_2Rows.y = this.CourierGold.y - this.Quickbuy_2Rows.Height

		const ClearQuickBuy_offset_x = GUIInfo.ScaleWidth(68, screen_size),
			ClearQuickBuy_offset_y = GUIInfo.ScaleHeight(8, screen_size)
		this.ClearQuickBuy_1Row.y = this.Quickbuy_1Row.y + ClearQuickBuy_offset_y
		this.ClearQuickBuy_2Rows.y = this.Quickbuy_2Rows.y + ClearQuickBuy_offset_y

		this.Sticky_1Row.Width = this.Sticky_2Rows.Width = GUIInfo.ScaleWidth(60, screen_size)
		this.Sticky_1Row.Height = this.Quickbuy_1Row.Height
		this.Sticky_2Rows.Height = this.Quickbuy_2Rows.Height

		this.Sticky_1Row.y = this.CourierGold.y - this.Sticky_1Row.Height
		this.Sticky_2Rows.y = this.CourierGold.y - this.Sticky_2Rows.Height

		if (hud_flip) {
			this.Quickbuy_1Row.x = this.Sticky_1Row.Width
			this.Quickbuy_2Rows.x = this.Sticky_2Rows.Width

			this.ClearQuickBuy_1Row.x = ClearQuickBuy_offset_x
			this.ClearQuickBuy_2Rows.x = ClearQuickBuy_offset_x
		} else {
			this.Sticky_1Row.x = screen_size.x - this.Sticky_1Row.Width
			this.Sticky_2Rows.x = screen_size.x - this.Sticky_2Rows.Width

			this.Quickbuy_1Row.x = screen_size.x - this.Quickbuy_1Row.Width - this.Sticky_1Row.Width
			this.Quickbuy_2Rows.x = screen_size.x - this.Quickbuy_2Rows.Width - this.Sticky_2Rows.Width

			this.ClearQuickBuy_1Row.x = screen_size.x - ClearQuickBuy_offset_x - this.ClearQuickBuy_1Row.Width
			this.ClearQuickBuy_2Rows.x = screen_size.x - ClearQuickBuy_offset_x - this.ClearQuickBuy_2Rows.Width
		}
	}
	private CalculateStash(screen_size: Vector2, hud_flip: boolean): void {
		const StashContainer = new Rectangle()
		StashContainer.Width = GUIInfo.ScaleWidth(750, screen_size)
		StashContainer.Height = GUIInfo.ScaleHeight(176, screen_size)

		StashContainer.y = (
			screen_size.y
			- (
				GUIInfo.ScaleHeight(56, screen_size)
				- GUIInfo.ScaleHeight(16, screen_size)
			)
			- StashContainer.Height
		)
		StashContainer.x = hud_flip
			? 0
			: screen_size.x - this.Stash.Width

		this.Stash.Width = GUIInfo.ScaleWidth(262, screen_size)
		this.Stash.Height = GUIInfo.ScaleHeight(72, screen_size)
		this.Stash.y = StashContainer.y
		this.Stash.x = hud_flip
			? 0
			: screen_size.x - this.Stash.Width

		const StashGrabAllMargin = GUIInfo.ScaleWidth(186, screen_size)
		this.StashGrabAll.Width = GUIInfo.ScaleWidth(102, screen_size)
		this.StashGrabAll.Height = GUIInfo.ScaleHeight(26, screen_size)
		this.StashGrabAll.y = StashContainer.y + GUIInfo.ScaleHeight(3, screen_size)
		this.StashGrabAll.x = hud_flip
			? StashContainer.x + StashGrabAllMargin
			: StashContainer.x - StashGrabAllMargin - this.StashGrabAll.Width

		const StashSlots = 6
		const ItemWidth = GUIInfo.ScaleWidth(38, screen_size),
			ItemHeight = GUIInfo.ScaleHeight(28, screen_size),
			ItemMarginTop = GUIInfo.ScaleHeight(2, screen_size),
			ItemMarginRight = GUIInfo.ScaleWidth(3, screen_size)
		const StashRow = new Rectangle()
		StashRow.Width = (ItemWidth + ItemMarginRight) * StashSlots
		StashRow.Height = ItemHeight
		StashRow.x = this.Stash.pos2.x - StashRow.Width - GUIInfo.ScaleWidth(7, screen_size)
		StashRow.y = this.Stash.y + GUIInfo.ScaleHeight(31, screen_size) + ItemMarginTop
		for (let i = 0; i < StashSlots; i++) {
			const ItemRect = new Rectangle()
			ItemRect.x = StashRow.x
			ItemRect.y = StashRow.y
			ItemRect.Width = ItemWidth
			ItemRect.Height = ItemHeight
			StashRow.x += ItemWidth + ItemMarginRight
			this.StashSlots.push(ItemRect)
		}
	}
}
