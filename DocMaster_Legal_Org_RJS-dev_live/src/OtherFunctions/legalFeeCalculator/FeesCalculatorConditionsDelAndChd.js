//min, max
//fixFee + atRateFee * (amountOfCase/forEveryPartAmount)
export const feeConditions = [
  { amountMinMax: "0,100", fixFee: 0, atRateFee: 0.5, forEveryPartAmount: 5 },
  {
    amountMinMax: "101,500",
    fixFee: 0,
    atRateFee: 1.0,
    forEveryPartAmount: 10,
  },
  {
    amountMinMax: "501,1000",
    fixFee: 0,
    atRateFee: 1.5,
    forEveryPartAmount: 10,
  },
  {
    amountMinMax: "1001,5000",
    fixFee: 28,
    atRateFee: 12.2,
    forEveryPartAmount: 100,
  },
  {
    amountMinMax: "5001,10000",
    fixFee: 150,
    atRateFee: 24.4,
    forEveryPartAmount: 250,
  },
  {
    amountMinMax: "10001,20000",
    fixFee: 396,
    atRateFee: 36.5,
    forEveryPartAmount: 500,
  },
  {
    amountMinMax: "20001,30000",
    fixFee: 880,
    atRateFee: 48.8,
    forEveryPartAmount: 1000,
  },
  {
    amountMinMax: "30001,50000",
    fixFee: 1612,
    atRateFee: 48.8,
    forEveryPartAmount: 2000,
  },
  {
    amountMinMax: "50001",
    fixFee: 2344,
    atRateFee: 48.8,
    forEveryPartAmount: 5000,
  },
];
