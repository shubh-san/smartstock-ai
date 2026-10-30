export const calculateDaysRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getExpiryStatus = (daysRemaining) => {
  if (daysRemaining < 0) {
    return {
      key: 'expired',
      color: 'bg-red-100 text-red-800 border-red-300',
      badgeColor: 'bg-red-600 text-white',
      dotColor: 'bg-red-600',
      borderCard: 'border-l-4 border-l-red-600',
      level: 4,
    };
  }
  if (daysRemaining <= 3) {
    return {
      key: 'danger',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      badgeColor: 'bg-rose-600 text-white',
      dotColor: 'bg-rose-600',
      borderCard: 'border-l-4 border-l-rose-600',
      level: 3,
    };
  }
  if (daysRemaining <= 7) {
    return {
      key: 'warning',
      color: 'bg-amber-50 text-amber-900 border-amber-300',
      badgeColor: 'bg-amber-500 text-white',
      dotColor: 'bg-amber-500',
      borderCard: 'border-l-4 border-l-amber-500',
      level: 2,
    };
  }
  return {
    key: 'safe',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badgeColor: 'bg-emerald-600 text-white',
    dotColor: 'bg-emerald-600',
    borderCard: 'border-l-4 border-l-emerald-600',
    level: 1,
  };
};

export const formatDisplayDate = (dateStr, lang = 'hi') => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = d.getDate();
  const month = lang === 'hi' ? monthsHi[d.getMonth()] : monthsEn[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getExpiryGroupKey = (daysRemaining) => {
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining === 0) return 'today';
  if (daysRemaining === 1) return 'tomorrow';
  if (daysRemaining <= 3) return 'threeDays';
  if (daysRemaining <= 7) return 'sevenDays';
  return 'thirtyDays';
};
