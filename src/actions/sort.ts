import NP from 'number-precision';
import * as Services from '../services';
import * as Enums from '../utils/enums';
import * as Utils from '../utils';
import * as Adapter from '../utils/adpters';
import { getFundApiTypeSetting } from './setting';
import CONST_STORAGE from '../constants/storage.json';

export interface FundSortMode {
  type: Enums.FundSortType;
  order: Enums.SortOrderType;
}
export interface ZindexSortMode {
  type: Enums.ZindexSortType;
  order: Enums.SortOrderType;
}

export const fundSortModeOptions: Option.EnumsOption<Enums.FundSortType>[] = [
  { key: Enums.FundSortType.Default, value: '默认' },
  { key: Enums.FundSortType.Growth, value: '今日涨幅' },
  { key: Enums.FundSortType.Block, value: '持有份额' },
  { key: Enums.FundSortType.Money, value: '今日收益' },
  { key: Enums.FundSortType.Estimate, value: '今日估值' },
];

export const zindexSortModeOptions: Option.EnumsOption<Enums.ZindexSortType>[] = [
  { key: Enums.ZindexSortType.Custom, value: '自定义' },
  { key: Enums.ZindexSortType.Zdd, value: '涨跌点' },
  { key: Enums.ZindexSortType.Zdf, value: '涨跌幅' },
  { key: Enums.ZindexSortType.Zsz, value: '指数值' },
];

export const getSortConfig = () => {
  const fundSortModeOptionsMap = fundSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as any);

  const zindexSortModeOptionsMap = zindexSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as any);

  return {
    fundSortModeOptions,
    zindexSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptionsMap,
  };
};

export const getSortMode: () => {
  fundSortMode: FundSortMode;
  zindexSortMode: ZindexSortMode;
} = () => {
  const fundSortMode = Utils.GetStorage(CONST_STORAGE.FUND_SORT_MODE, {
    type: Enums.FundSortType.Default,
    order: Enums.SortOrderType.Desc,
  });
  const zindexSortMode = Utils.GetStorage(CONST_STORAGE.ZINDEX_SORT_MODE, {
    type: Enums.ZindexSortType.Custom,
    order: Enums.SortOrderType.Desc,
  });
  return { fundSortMode, zindexSortMode };
};

export const setFundSortMode: (fundSortMode: {
  type?: Enums.FundSortType;
  order?: Enums.SortOrderType;
}) => void = (fundSortMode) => {
  const { fundSortMode: _ } = getSortMode();
  Utils.SetStorage(CONST_STORAGE.FUND_SORT_MODE, {
    ..._,
    ...fundSortMode,
  });
};

export const setZindexSortMode: (zindexSortMode: {
  type?: Enums.ZindexSortType;
  order?: Enums.SortOrderType;
}) => void = (zindexSortMode) => {
  const { zindexSortMode: _ } = getSortMode();
  Utils.SetStorage(CONST_STORAGE.ZINDEX_SORT_MODE, {
    ..._,
    ...zindexSortMode,
  });
};

export const troggleFundSortOrder = () => {
  const { fundSortMode } = getSortMode();
  const { order } = fundSortMode;
  Utils.SetStorage(CONST_STORAGE.FUND_SORT_MODE, {
    ...fundSortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
};

export const troggleZindexSortOrder = () => {
  const { zindexSortMode } = getSortMode();
  const { order } = zindexSortMode;
  Utils.SetStorage(CONST_STORAGE.ZINDEX_SORT_MODE, {
    ...zindexSortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
};