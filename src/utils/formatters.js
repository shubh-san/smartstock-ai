export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0);
};

export const interpolate = (template, variables = {}) => {
  if (!template) return '';
  return Object.keys(variables).reduce((acc, key) => {
    return acc.replaceAll(`{${key}}`, variables[key]);
  }, template);
};
