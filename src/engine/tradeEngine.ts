import type {
  MarketListing,
  TradeRecord,
  PriceSuggestion,
  GeneRevolutionEvent,
  Clone,
  GeneSample,
  Rarity,
  ListingType,
} from '@/types';
import { generateId, randomRange } from '@/utils';

function isClone(item: Clone | GeneSample): item is Clone {
  return 'race' in item && 'element' in item && 'syncRate' in item;
}

function getRarityName(rarity: Rarity): string {
  const rarityMap: Record<Rarity, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return rarityMap[rarity] || rarity;
}

export function createListing(
  seller: { id: string; name: string },
  item: Clone | GeneSample,
  price: number,
  durationHours: number = 24
): MarketListing {
  const now = Date.now();
  const type: ListingType = isClone(item) ? 'clone' : 'gene';

  return {
    id: generateId(),
    sellerId: seller.id,
    sellerName: seller.name,
    type,
    item,
    price,
    createdAt: now,
    expiresAt: now + durationHours * 3600 * 1000,
  };
}

export function cancelListing(
  listingId: string,
  sellerId: string,
  listings: MarketListing[]
): MarketListing[] {
  return listings.filter(
    (listing) => !(listing.id === listingId && listing.sellerId === sellerId)
  );
}

export function getSevenDayAverage(
  itemType: ListingType,
  rarity: Rarity,
  history: TradeRecord[]
): number {
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const filteredRecords = history.filter(
    (record) =>
      record.type === itemType &&
      record.itemRarity === rarity &&
      record.timestamp >= sevenDaysAgo
  );

  if (filteredRecords.length === 0) {
    return 0;
  }

  const total = filteredRecords.reduce((sum, record) => sum + record.price, 0);
  return Math.floor(total / filteredRecords.length);
}

export function getPriceSuggestion(
  item: Clone | GeneSample,
  tradeHistory: TradeRecord[]
): PriceSuggestion {
  const itemType: ListingType = isClone(item) ? 'clone' : 'gene';
  const sevenDayAvg = getSevenDayAverage(itemType, item.rarity, tradeHistory);

  const basePrice = sevenDayAvg > 0 ? sevenDayAvg : (item.rarity === 'legendary' ? 5000 : item.rarity === 'epic' ? 2000 : item.rarity === 'rare' ? 800 : 300);
  const average = basePrice;
  const min = Math.floor(average * 0.8);
  const max = Math.ceil(average * 1.2);

  const recentRecords = tradeHistory
    .filter((record) => record.type === itemType && record.itemRarity === item.rarity)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (recentRecords.length >= 3) {
    const [first, second, third] = recentRecords;
    if (first.price > second.price && second.price > third.price) {
      trend = 'up';
    } else if (first.price < second.price && second.price < third.price) {
      trend = 'down';
    }
  }

  return {
    min,
    max,
    average,
    sevenDayAvg,
    trend,
  };
}

export function executeTrade(
  buyer: { id: string; name: string; gold: number },
  listing: MarketListing
): {
  success: boolean;
  record: TradeRecord | null;
  remainingGold: number;
  message: string;
} {
  if (buyer.gold < listing.price) {
    return {
      success: false,
      record: null,
      remainingGold: buyer.gold,
      message: '金币不足，无法完成交易',
    };
  }

  if (Date.now() > listing.expiresAt) {
    return {
      success: false,
      record: null,
      remainingGold: buyer.gold,
      message: '该挂单已过期',
    };
  }

  const remainingGold = buyer.gold - listing.price;
  const record: TradeRecord = {
    id: generateId(),
    buyerId: buyer.id,
    buyerName: buyer.name,
    sellerId: listing.sellerId,
    sellerName: listing.sellerName,
    type: listing.type,
    itemName: listing.item.name,
    itemRarity: listing.item.rarity,
    price: listing.price,
    timestamp: Date.now(),
  };

  return {
    success: true,
    record,
    remainingGold,
    message: `交易成功！花费 ${listing.price} 金币购买了 ${listing.item.name}`,
  };
}

export function checkGeneRevolution(
  recentRecords: TradeRecord[],
  currentEvent: GeneRevolutionEvent | null
): GeneRevolutionEvent | null {
  if (currentEvent && Date.now() < currentEvent.endTime) {
    return currentEvent;
  }

  const oneHourAgo = Date.now() - 3600 * 1000;
  const highValueTrades = recentRecords.filter(
    (record) =>
      (record.itemRarity === 'legendary' || record.itemRarity === 'epic') &&
      record.timestamp >= oneHourAgo
  );

  if (highValueTrades.length >= 3) {
    const now = Date.now();
    const triggerRecord = highValueTrades[highValueTrades.length - 1];
    return {
      id: generateId(),
      startTime: now,
      endTime: now + 24 * 3600 * 1000,
      successRateBonus: 0.05,
      triggeredBy: triggerRecord.buyerName,
      itemName: triggerRecord.itemName,
    };
  }

  return null;
}

export function generateAnnouncement(record: TradeRecord): string {
  const rarityName = getRarityName(record.itemRarity);
  const typeName = record.type === 'clone' ? '克隆体' : '基因样本';
  return `玩家[${record.sellerName}]以[${record.price}]金币出售了[${rarityName}]${typeName}[${record.itemName}]给[${record.buyerName}]！`;
}
