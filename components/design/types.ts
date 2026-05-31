import * as React from 'react';

export type StockCategory =
  | 'valuation'
  | 'consumer_hate'
  | 'brand_decay'
  | 'bags'
  | 'structural_decay'
  | 'never_profitable'
  | 'undervalued';

export const CAT_LABEL: Record<StockCategory, string> = {
  valuation: 'VALUATION',
  consumer_hate: 'CONSUMER HATE',
  brand_decay: 'BRAND DECAY',
  bags: 'BAGS',
  structural_decay: 'STRUCTURAL DECAY',
  never_profitable: 'NEVER PROFITABLE',
  undervalued: 'UNDERVALUED · DCF',
};

export interface StockData {
  ticker: string;
  name: string;
  mkt: string;
  price: string;
  chg: string;
  score: number;
  over: string;
  shortInt: string;
  trust: string;
  cat: StockCategory;
  note?: string;
  sentiment?: string;
}
