const unitDefinitions = {
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

function getConvertibleUnits(sourceUnit) {
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

function convertValue(value, sourceUnit, targetUnit) {
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

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
  }).format(value);
}

const sourceUnitSelect = document.getElementById("sourceUnit");
const targetUnitSelect = document.getElementById("targetUnit");
const inputValueElement = document.getElementById("inputValue");
const convertButton = document.getElementById("convertBtn");
const resultText = document.getElementById("resultText");

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function populateSourceUnits() {
  const units = Object.entries(unitDefinitions);
  units.forEach(([unitName, unitMeta]) => {
    sourceUnitSelect.appendChild(createOption(unitName, unitMeta.label));
  });
}

function populateTargetUnitsFor(sourceUnit) {
  targetUnitSelect.innerHTML = "";

  const convertibleUnits = getConvertibleUnits(sourceUnit);
  convertibleUnits.forEach(({ unit, label }) => {
    targetUnitSelect.appendChild(createOption(unit, label));
  });

  if (convertibleUnits.length === 0) {
    targetUnitSelect.appendChild(createOption("", "No compatible units available"));
    targetUnitSelect.disabled = true;
  } else {
    targetUnitSelect.disabled = false;
  }
}

function runConversion() {
  const sourceUnit = sourceUnitSelect.value;
  const targetUnit = targetUnitSelect.value;
  const inputValue = inputValueElement.value;

  if (inputValue === "") {
    resultText.textContent = "Please enter a value to convert.";
    return;
  }

  try {
    const converted = convertValue(inputValue, sourceUnit, targetUnit);
    resultText.textContent = `${formatNumber(Number(inputValue))} ${unitDefinitions[sourceUnit].label} = ${formatNumber(converted)} ${unitDefinitions[targetUnit].label}`;
  } catch (error) {
    resultText.textContent = error.message;
  }
}

populateSourceUnits();
sourceUnitSelect.value = "meter";
populateTargetUnitsFor(sourceUnitSelect.value);

sourceUnitSelect.addEventListener("change", () => {
  populateTargetUnitsFor(sourceUnitSelect.value);
});

convertButton.addEventListener("click", runConversion);
inputValueElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runConversion();
  }
});
