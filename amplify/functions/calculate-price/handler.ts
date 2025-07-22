import type { AppSyncResolverHandler } from 'aws-lambda';

// Price calculation logic for PrintLite
interface PriceCalculationArgs {
  pages: number;
  copies: number;
  paperType: string;
  printType: string;
  paperQuality: string;
}

interface PriceResult {
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  breakdown: string;
}

// Pricing configuration (in INR)
const PRICING_CONFIG = {
  paperType: {
    'A4': 1.0,
    'A3': 2.0,
    'Letter': 1.0
  },
  paperQuality: {
    '70GSM': 1.0,
    '90GSM': 1.2,
    '120GSM': 1.5
  },
  printType: {
    'blackwhite': 2.0, // ₹2 per page for B&W
    'color': 8.0       // ₹8 per page for color
  },
  sides: {
    'single': 1.0,
    'double': 0.7  // 30% discount for double-sided
  }
};

const TAX_RATE = 0.18; // 18% GST

export const handler: AppSyncResolverHandler<PriceCalculationArgs, PriceResult> = async (event) => {
  const { pages, copies, paperType, printType, paperQuality } = event.arguments;

  try {
    // Base price calculation
    const basePrice = PRICING_CONFIG.printType[printType as keyof typeof PRICING_CONFIG.printType] || 2.0;
    const paperTypeMultiplier = PRICING_CONFIG.paperType[paperType as keyof typeof PRICING_CONFIG.paperType] || 1.0;
    const paperQualityMultiplier = PRICING_CONFIG.paperQuality[paperQuality as keyof typeof PRICING_CONFIG.paperQuality] || 1.0;

    // Calculate subtotal
    const pricePerPage = basePrice * paperTypeMultiplier * paperQualityMultiplier;
    const subtotal = pricePerPage * pages * copies;

    // Calculate taxes
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;

    // Create breakdown string
    const breakdown = [
      `Base price: ₹${basePrice}/page`,
      `Paper type (${paperType}): ${paperTypeMultiplier}x`,
      `Quality (${paperQuality}): ${paperQualityMultiplier}x`,
      `Pages: ${pages} × Copies: ${copies}`,
      `Subtotal: ₹${subtotal.toFixed(2)}`,
      `GST (18%): ₹${taxes.toFixed(2)}`
    ].join(', ');

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: 'INR',
      breakdown
    };

  } catch (error) {
    console.error('Price calculation error:', error);
    throw new Error('Failed to calculate price');
  }
};