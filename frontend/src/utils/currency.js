/**
 * Currency Utility for Gahana Jewelry
 * Indian Rupee (INR) Formatting with Indian Numbering System
 */

/**
 * Formats a numeric value into standard Indian Rupee notation (e.g. ₹1,25,000)
 * @param {number} amount - Amount in Indian Rupees
 * @returns {string} Formatted Indian Rupee string
 */
export const formatInr = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Backward compatibility alias so legacy components render correct INR
 */
export const formatInrAsUsd = (amount) => {
  return formatInr(amount);
};

export const formatUsd = (amount) => {
  return formatInr(amount);
};

/**
 * Calculates standard jewelry price breakdown based on Indian bullion regulations
 * @param {number} basePrice - Total product price
 * @returns {Object} itemized breakdown
 */
export const calculateJewelryBreakdown = (basePrice) => {
  const price = Number(basePrice) || 0;
  // Standard Indian jewelry composition estimation:
  // Net price + 3% GST
  const netAmount = Math.round(price / 1.03);
  const gstAmount = price - netAmount;
  const makingCharges = Math.round(netAmount * 0.12);
  const metalValue = netAmount - makingCharges;

  return {
    total: price,
    metalValue,
    makingCharges,
    gstAmount,
    gstRate: '3%',
  };
};

export default {
  formatInr,
  formatInrAsUsd,
  formatUsd,
  calculateJewelryBreakdown,
};
