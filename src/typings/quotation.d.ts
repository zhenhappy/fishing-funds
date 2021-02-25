declare namespace Quotation {
  export interface SettingItem {}

  export interface ResponseItem {
    name: string; // 名称 '有色金属'
    zxj: number; // 最新价
    zde: number; // 涨跌额
    zdf: number; // 涨跌幅 -0.44
    zsz: number; // 总市值
    lzgpCode: string; // 领涨股票code
    lzgpName: string; // 领涨股票
    lzgpZdf: number; // 领涨股票涨跌幅
    hs: number; // 换手
    szjs: number; // 上涨家数
    xdjs: number; // 下跌家数
  }

  export interface ExtraRow {
    collapse?: boolean;
  }
}