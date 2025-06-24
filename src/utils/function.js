import EncryptedStorage from 'react-native-encrypted-storage';

export const getUserInfo = async () => {
  try {
    const userData = JSON.parse(await EncryptedStorage.getItem('userData'));
    return userData;
  } catch (error) {
    console.log('Get user info error', error);
  }
};

export function formatPriceIndian(price) {
  // Check if the price is undefined or null
  if (price === undefined || price === null) {
    return "---";
  }

  // Convert the price to a string
  const priceStr = price.toString();
  // Split the integer and decimal parts
  const [integerPart, decimalPart] = priceStr.split('.');

  // If the integer part is less than 1000, return it as is
  if (integerPart.length <= 3) {
    return decimalPart
      ? `${integerPart}.${decimalPart}`
      : integerPart;
  }

  // Format the integer part with commas
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formattedIntegerPart =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;

  // Return the formatted price with decimal part if it exists
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}