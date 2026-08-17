// Generates a short, human-friendly tracking number like "MX-4821"
const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `MX-${random}`;
};

export default generateOrderNumber;