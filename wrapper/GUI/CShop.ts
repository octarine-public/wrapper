import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class CShop {
	public readonly CourierGold = new Rectangle()
	public readonly Courier = new Rectangle()
	public readonly ShopButton = new Rectangle()
	public readonly Quickbuy1Row = new Rectangle()
	public readonly Quickbuy2Rows = new Rectangle()
	public readonly Sticky1Row = new Rectangle()
	public readonly Sticky2Rows = new Rectangle()
	public readonly ClearQuickBuy1Row = new Rectangle()
	public readonly BuyBackProtection = new Rectangle()
	public readonly ClearQuickBuy2Rows = new Rectangle()
	public readonly Stash = new Rectangle()
	public readonly StashSlots: Rectangle[] = []
	public readonly StashGrabAll = new Rectangle()

	constructor(screenSize: Vector2, hudFlipped: boolean) {
		this.CalculateQuickbuyAndSticky(screenSize, hudFlipped)
		this.CalculateCourierGold(screenSize, hudFlipped)
		this.CalculateStash(screenSize, hudFlipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(
			this.CourierGold.pos1,
			this.CourierGold.Size,
			Color.Blue.SetA(128)
		)
		RendererSDK.FilledRect(
			this.ShopButton.pos1,
			this.ShopButton.Size,
			Color.Yellow.SetA(128)
		)

		RendererSDK.FilledRect(
			this.Sticky1Row.pos1,
			this.Sticky1Row.Size,
			Color.Aqua.SetA(128)
		)
		RendererSDK.FilledRect(
			this.Quickbuy1Row.pos1,
			this.Quickbuy1Row.Size,
			Color.Green.SetA(128)
		)
		RendererSDK.FilledRect(
			this.BuyBackProtection.pos1,
			this.BuyBackProtection.Size,
			Color.Red.SetA(128)
		)

		RendererSDK.FilledRect(this.Stash.pos1, this.Stash.Size, Color.Gray.SetA(128))
		RendererSDK.FilledRect(
			this.StashGrabAll.pos1,
			this.StashGrabAll.Size,
			Color.Red.SetA(128)
		)
		for (let i = 0, end = this.StashSlots.length; i < end; i++) {
			const rect = this.StashSlots[i]
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		}
	}
	public HasChanged(): boolean {
		return false
	}
	private CalculateCourierGold(screenSize: Vector2, hudFlip: boolean): void {
		this.ShopButton.Width = ScaleWidth(100, screenSize)
		this.ShopButton.Height = ScaleHeight(36, screenSize)
		this.ShopButton.x = !hudFlip
			? this.Quickbuy1Row.x + ScaleWidth(8, screenSize)
			: ScaleWidth(8, screenSize)
		this.ShopButton.y =
			screenSize.y - this.ShopButton.Height - ScaleHeight(12, screenSize)

		this.Courier.Width = ScaleWidth(132, screenSize)
		this.Courier.Height = ScaleHeight(60, screenSize)
		this.Courier.x = !hudFlip
			? this.Quickbuy1Row.x + ScaleWidth(114, screenSize)
			: ScaleWidth(115, screenSize)
		this.Courier.y = screenSize.y - this.Courier.Height

		this.CourierGold.pos1.x = 0
		if (!hudFlip) {
			this.CourierGold.pos1.x = this.Quickbuy1Row.x
		}
		this.CourierGold.pos1.y = this.Courier.pos1.y
		this.CourierGold.pos2.x = hudFlip ? this.Quickbuy1Row.pos2.x : screenSize.x
		this.CourierGold.pos2.y = screenSize.y
	}
	private CalculateQuickbuyAndSticky(screenSize: Vector2, hudFlip: boolean): void {
		this.BuyBackProtection.Width = this.ClearQuickBuy2Rows.Width = ScaleWidth(
			28,
			screenSize
		)
		this.BuyBackProtection.Height = this.ClearQuickBuy2Rows.Height = ScaleHeight(
			28,
			screenSize
		)

		const quickbuyRowsWidth = ScaleWidth(292, screenSize),
			stickyWidth = ScaleWidth(53, screenSize)
		const quickbuyRowsY = screenSize.y - ScaleHeight(60, screenSize)

		this.Quickbuy1Row.Width = this.Quickbuy2Rows.Width =
			quickbuyRowsWidth - stickyWidth
		this.Quickbuy1Row.Height = ScaleHeight(40, screenSize)
		this.Quickbuy2Rows.Height = ScaleHeight(74, screenSize)
		this.Quickbuy1Row.y = quickbuyRowsY - this.Quickbuy1Row.Height
		this.Quickbuy2Rows.y = quickbuyRowsY - this.Quickbuy2Rows.Height

		const buyBackProtectionOffsetX = ScaleWidth(!hudFlip ? 57 : 62, screenSize),
			buyBackProtectionOffsetY = ScaleHeight(4, screenSize)
		this.BuyBackProtection.y = this.Quickbuy1Row.y + buyBackProtectionOffsetY
		this.ClearQuickBuy2Rows.y = this.Quickbuy2Rows.y + buyBackProtectionOffsetX

		this.Sticky1Row.Width = this.Sticky2Rows.Width = stickyWidth
		this.Sticky1Row.Height = this.Quickbuy1Row.Height
		this.Sticky2Rows.Height = this.Quickbuy2Rows.Height

		this.Sticky1Row.y = quickbuyRowsY - this.Sticky1Row.Height
		this.Sticky2Rows.y = quickbuyRowsY - this.Sticky2Rows.Height

		if (hudFlip) {
			this.Quickbuy1Row.x = this.Sticky1Row.Width
			this.Quickbuy2Rows.x = this.Sticky2Rows.Width

			this.BuyBackProtection.x = buyBackProtectionOffsetX
			this.ClearQuickBuy2Rows.x = buyBackProtectionOffsetX
		} else {
			this.Sticky1Row.x = screenSize.x - this.Sticky1Row.Width
			this.Sticky2Rows.x = screenSize.x - this.Sticky2Rows.Width

			this.Quickbuy1Row.x =
				screenSize.x - this.Quickbuy1Row.Width - this.Sticky1Row.Width
			this.Quickbuy2Rows.x =
				screenSize.x - this.Quickbuy2Rows.Width - this.Sticky2Rows.Width

			this.BuyBackProtection.x =
				screenSize.x - buyBackProtectionOffsetX - this.BuyBackProtection.Width
			this.ClearQuickBuy2Rows.x =
				screenSize.x - buyBackProtectionOffsetX - this.ClearQuickBuy2Rows.Width
		}
	}
	private CalculateStash(screenSize: Vector2, hudFlip: boolean): void {
		const StashContainer = new Rectangle()
		StashContainer.Width = ScaleWidth(750, screenSize)
		StashContainer.Height = ScaleHeight(176, screenSize)

		StashContainer.y =
			screenSize.y -
			(ScaleHeight(45, screenSize) - ScaleHeight(16, screenSize)) -
			StashContainer.Height
		StashContainer.x = hudFlip ? 0 : screenSize.x - this.Stash.Width

		this.Stash.Width = ScaleWidth(290, screenSize)
		this.Stash.Height = ScaleHeight(67, screenSize)
		this.Stash.y = StashContainer.y
		this.Stash.x = hudFlip ? 0 : screenSize.x - this.Stash.Width

		const StashGrabAllMargin = ScaleWidth(230, screenSize)
		this.StashGrabAll.Width = ScaleWidth(88, screenSize)
		this.StashGrabAll.Height = ScaleHeight(20, screenSize)
		this.StashGrabAll.y = StashContainer.y + ScaleHeight(6, screenSize)
		this.StashGrabAll.x = hudFlip
			? StashContainer.x + StashGrabAllMargin
			: StashContainer.x - StashGrabAllMargin - this.StashGrabAll.Width

		const StashSlots = 6
		const ItemWidth = ScaleWidth(38, screenSize),
			ItemHeight = ScaleHeight(28, screenSize),
			ItemMarginTop = ScaleHeight(2, screenSize),
			ItemMarginRight = ScaleWidth(3, screenSize)
		const StashRow = new Rectangle()
		StashRow.Width = (ItemWidth + ItemMarginRight) * StashSlots
		StashRow.Height = ItemHeight
		StashRow.x = this.Stash.pos2.x - StashRow.Width - ScaleWidth(21, screenSize)
		StashRow.y = this.Stash.y + ScaleHeight(31, screenSize) + ItemMarginTop
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
