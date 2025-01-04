interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

export const CURRENCIES: { [key: string]: CurrencyInfo } = {
  'KE': { code: 'KES', symbol: 'KSh', rate: 1 },
  'NG': { code: 'NGN', symbol: '₦', rate: 1 },
  'GH': { code: 'GHS', symbol: 'GH₵', rate: 1 },
  'TZ': { code: 'TZS', symbol: 'TSh', rate: 1 },
  'UG': { code: 'UGX', symbol: 'USh', rate: 1 },
  'RW': { code: 'RWF', symbol: 'RF', rate: 1 },
  'ZA': { code: 'ZAR', symbol: 'R', rate: 1 },
  'ET': { code: 'ETB', symbol: 'Br', rate: 1 },
  'EG': { code: 'EGP', symbol: 'E£', rate: 1 },
  'MA': { code: 'MAD', symbol: 'DH', rate: 1 },
  'US': { code: 'USD', symbol: '$', rate: 1 },
};

export const formatCurrencyValue = (price: number, currency: CurrencyInfo): string => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  
  return `${currency.symbol} ${formattedNumber}`;
};

export const getCountryName = (code: string): string => {
  const countries: { [key: string]: string } = {
    'KE': 'Kenya',
    'NG': 'Nigeria',
    'GH': 'Ghana',
    'TZ': 'Tanzania',
    'UG': 'Uganda',
    'RW': 'Rwanda',
    'ZA': 'South Africa',
    'ET': 'Ethiopia',
    'EG': 'Egypt',
    'MA': 'Morocco',
    'US': 'United States',
  };
  return countries[code] || code;
};