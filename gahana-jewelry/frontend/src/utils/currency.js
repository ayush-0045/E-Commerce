// Conversion rate: 1 USD = 83.34 INR (as of current date)
const USD_TO_INR_RATE = 83.34;

/**
 * Converts INR to USD
 * @param {number} inrAmount - Amount in Indian Rupees
 * @returns {number} Amount in US Dollars
 */
export const inrToUsd = (inrAmount) => {
  return inrAmount / USD_TO_INR_RATE;
};

/**
 * Formats a number as USD currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatUsd = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Converts and formats INR to USD
 * @param {number} inrAmount - Amount in Indian Rupees
 * @returns {string} Formatted USD string (e.g., "$1,234.56")
 */
export const formatInrAsUsd = (inrAmount) => {
  if (inrAmount === undefined || inrAmount === null) return '';
  return formatUsd(inrToUsd(inrAmount));
};
