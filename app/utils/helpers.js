export function formatNumber(number) {
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  const parsedNumber = parseFloat(number); // Parse the string to a number

  if (Math.abs(parsedNumber) >= billion) {
    return (parsedNumber / billion).toFixed(2) + 'B';
  } else if (Math.abs(parsedNumber) >= million) {
    return (parsedNumber / million).toFixed(2) + 'M';
  } else if (Math.abs(parsedNumber) >= thousand) {
    return (parsedNumber / thousand).toFixed(2) + 'K';
  }

  return parsedNumber.toFixed(2);
}

export function calculateLTVRatio(
  totalCollateral,
  collateralPrice,
  totalDebt,
  debtPrice
) {
  // Calculate the value of collateral
  const collateralValue = totalCollateral * collateralPrice;

  // Calculate the value of debt
  const debtValue = totalDebt * debtPrice;

  // Calculate the LTV ratio
  const ltvRatio = (debtValue / collateralValue) * 100;

  if (isNaN(ltvRatio)) return 0;

  // Return the LTV ratio rounded to two decimal places
  return parseFloat(ltvRatio.toFixed(2));
}

export const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};
