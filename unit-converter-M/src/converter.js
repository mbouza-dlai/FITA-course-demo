export const unitDefinitions = {
  millimeter: { label: "Millimeters (mm)", category: "distance", toBase: 0.001 },
  centimeter: { label: "Centimeters (cm)", category: "distance", toBase: 0.01 },
  meter: { label: "Meters (m)", category: "distance", toBase: 1 },
  kilometer: { label: "Kilometers (km)", category: "distance", toBase: 1000 },
  inch: { label: "Inches (in)", category: "distance", toBase: 0.0254 },
  foot: { label: "Feet (ft)", category: "distance", toBase: 0.3048 },
  yard: { label: "Yards (yd)", category: "distance", toBase: 0.9144 },
  mile: { label: "Miles (mi)", category: "distance", toBase: 1609.344 },

  milligram: { label: "Milligrams (mg)", category: "weight", toBase: 0.001 },
  gram: { label: "Grams (g)", category: "weight", toBase: 1 },
  kilogram: { label: "Kilograms (kg)", category: "weight", toBase: 1000 },
  ounce: { label: "Ounces (oz)", category: "weight", toBase: 28.349523125 },
  pound: { label: "Pounds (lb)", category: "weight", toBase: 453.59237 },
  ton: { label: "Metric Tons (t)", category: "weight", toBase: 1000000 },

  teaspoon: { label: "Teaspoons (tsp)", category: "volume", toBase: 0.00492892159375 },
  tablespoon: { label: "Tablespoons (tbsp)", category: "volume", toBase: 0.01478676478125 },
  fluidOunce: { label: "Fluid Ounces (fl oz)", category: "volume", toBase: 0.0295735295625 },
  cup: { label: "Cups (US cup)", category: "volume", toBase: 0.2365882365 },
  pint: { label: "Pints (US pt)", category: "volume", toBase: 0.473176473 },
  quart: { label: "Quarts (US qt)", category: "volume", toBase: 0.946352946 },
  liter: { label: "Liters (L)", category: "volume", toBase: 1 },
  gallon: { label: "Gallons (US gal)", category: "volume", toBase: 3.785411784 },
  milliliter: { label: "Milliliters (mL)", category: "volume", toBase: 0.001 },
};

export function getConvertibleUnits(sourceUnit) {
  const source = unitDefinitions[sourceUnit];
  if (!source) {
    return [];
  }

  return Object.entries(unitDefinitions)
    .filter(([unitName, unitMeta]) => {
      return unitMeta.category === source.category && unitName !== sourceUnit;
    })
    .map(([unitName, unitMeta]) => ({
      unit: unitName,
      label: unitMeta.label,
    }));
}

export function convertValue(value, sourceUnit, targetUnit) {
  const source = unitDefinitions[sourceUnit];
  const target = unitDefinitions[targetUnit];

  if (!source || !target) {
    throw new Error("Unknown unit selected.");
  }

  if (source.category !== target.category) {
    throw new Error("Units must be from the same category.");
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    throw new Error("Value must be a valid number.");
  }

  const valueInBase = numericValue * source.toBase;
  return valueInBase / target.toBase;
}

export function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
  }).format(value);
}
