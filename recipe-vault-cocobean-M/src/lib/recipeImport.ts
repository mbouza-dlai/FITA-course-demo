import { RecipeFormValues } from '../components/RecipeForm';

function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function lastPathSegment(url: string): string {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop();
    return (seg || url).replace(/([A-Z])/g, ' $1').trim();
  } catch {
    return url;
  }
}

function parseRecipeFromLD(obj: any): RecipeFormValues | null {
  if (!obj) return null;
  const items: any[] = [];
  if (Array.isArray(obj)) items.push(...obj);
  else if (obj['@graph']) items.push(...toArray(obj['@graph']));
  else items.push(obj);

  let recipeNode: any | null = null;
  for (const item of items) {
    const type = item['@type'];
    if (!type) continue;
    const types = toArray<string>(type as any).map((t) => String(t).toLowerCase());
    if (types.includes('recipe')) {
      recipeNode = item;
      break;
    }
  }
  if (!recipeNode) return null;

  const name = String(recipeNode.name || '').trim();

  const imageField = recipeNode.image;
  const images: string[] = [];
  if (typeof imageField === 'string') images.push(imageField);
  else if (Array.isArray(imageField)) {
    for (const i of imageField) {
      if (typeof i === 'string') images.push(i);
      else if (i && typeof i === 'object' && typeof i.url === 'string') images.push(i.url);
    }
  } else if (imageField && typeof imageField === 'object' && typeof imageField.url === 'string') {
    images.push(imageField.url);
  }

  const ingRaw: string[] = toArray<string>(recipeNode.recipeIngredient).filter(Boolean) as string[];
  const ingredients = ingRaw.length
    ? ingRaw.map((s) => ({ name: String(s).trim(), quantity: '' }))
    : [];

  let instructions = '';
  const instr = recipeNode.recipeInstructions;
  if (typeof instr === 'string') instructions = instr.trim();
  else if (Array.isArray(instr)) {
    const parts: string[] = [];
    for (const step of instr) {
      if (typeof step === 'string') parts.push(step.trim());
      else if (step && typeof step === 'object') {
        if (typeof step.text === 'string') parts.push(step.text.trim());
        else if (typeof step.name === 'string') parts.push(step.name.trim());
      }
    }
    instructions = parts.filter(Boolean).join('\n');
  } else if (instr && typeof instr === 'object' && typeof instr.text === 'string') {
    instructions = instr.text.trim();
  }

  let cuisine = '';
  const cuisineField = recipeNode.recipeCuisine;
  if (typeof cuisineField === 'string') cuisine = cuisineField.trim();
  else if (Array.isArray(cuisineField) && cuisineField.length) cuisine = String(cuisineField[0]).trim();

  const tags: string[] = [];
  const suitable = toArray<string>(recipeNode.suitableForDiet).filter(Boolean) as string[];
  for (const s of suitable) {
    if (s.startsWith('http')) tags.push(lastPathSegment(s));
    else tags.push(s);
  }
  if (typeof recipeNode.keywords === 'string') {
    const kw = recipeNode.keywords
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean);
    for (const k of kw) if (!tags.includes(k)) tags.push(k);
  }

  const values: RecipeFormValues = {
    name: name || '',
    cuisine,
    ingredients: ingredients.length ? ingredients : [{ name: '', quantity: '' }],
    instructions: instructions || '',
    dietary_tags: tags,
    notes: '',
    images,
  };

  return values;
}

function textContent(el: Element | null | undefined): string {
  return (el?.textContent || '').trim();
}

function selectMeta(doc: Document, name: string): string | null {
  const el = doc.querySelector(`meta[property="${name}"]`) || doc.querySelector(`meta[name="${name}"]`);
  return el?.getAttribute('content') || null;
}

function looksLikeIngredient(str: string): boolean {
  const s = str.toLowerCase();
  // Simple heuristics: units, numbers, fractions
  return /\b(cup|cups|tbsp|tablespoon|tsp|teaspoon|oz|ounce|g|gram|kg|ml|l|pound|lb|clove|slice|pinch|dash)\b/.test(s) || /\d/.test(s) || /\d\s*\/\s*\d/.test(s);
}

function parseHeuristic(html: string): RecipeFormValues | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const name = selectMeta(doc, 'og:title') || textContent(doc.querySelector('h1')) || (doc.title || '').trim();

  // Try to locate ingredients
  const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')) as HTMLElement[];
  const ingHeading = headings.find((h) => /ingredient/i.test(h.textContent || ''));
  let ingList: string[] = [];
  if (ingHeading) {
    // find next list near this heading
    let next: Element | null = ingHeading.nextElementSibling;
    let tries = 0;
    while (next && tries < 5) {
      if (next.tagName === 'UL' || next.tagName === 'OL') {
        ingList = Array.from(next.querySelectorAll('li')).map((li) => textContent(li)).filter(Boolean);
        break;
      }
      next = next.nextElementSibling;
      tries++;
    }
  }
  if (ingList.length === 0) {
    // Fallback: any list with many items that look like ingredients
    const lists = Array.from(doc.querySelectorAll('ul,ol'));
    let best: string[] = [];
    for (const list of lists) {
      const items = Array.from(list.querySelectorAll('li')).map((li) => textContent(li)).filter(Boolean);
      const score = items.filter(looksLikeIngredient).length;
      if (items.length >= 3 && score >= Math.max(2, Math.floor(items.length * 0.4))) {
        if (items.length > best.length) best = items;
      }
    }
    ingList = best;
  }

  // Try instructions
  const instrHeading = headings.find((h) => /(instruction|direction|method|preparation|steps)/i.test(h.textContent || ''));
  let instrText = '';
  if (instrHeading) {
    const paras: string[] = [];
    let next: Element | null = instrHeading.nextElementSibling;
    let tries = 0;
    while (next && tries < 10) {
      if (next.tagName === 'P') paras.push(textContent(next));
      if (next.tagName === 'OL' || next.tagName === 'UL') {
        const steps = Array.from(next.querySelectorAll('li')).map((li) => textContent(li)).filter(Boolean);
        if (steps.length) paras.push(steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
      }
      next = next.nextElementSibling;
      tries++;
    }
    instrText = paras.filter(Boolean).join('\n');
  }
  if (!instrText) {
    // Fallback: longest ordered list
    let best: string[] = [];
    const lists = Array.from(doc.querySelectorAll('ol'));
    for (const list of lists) {
      const items = Array.from(list.querySelectorAll('li')).map((li) => textContent(li)).filter(Boolean);
      if (items.length > best.length) best = items;
    }
    if (best.length) instrText = best.map((s, i) => `${i + 1}. ${s}`).join('\n');
  }

  // Cuisine guess (very rough): look for keywords in metadata or tags
  const cuisineGuess = selectMeta(doc, 'article:section') || '';

  // Tags: from meta keywords
  const keywords = selectMeta(doc, 'keywords') || '';
  const tags = keywords
    ? keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  // Images
  const ogImg = selectMeta(doc, 'og:image');
  const imgTag = doc.querySelector('img');
  const images = [ogImg, imgTag?.getAttribute('src') || ''].filter(Boolean) as string[];

  const ingredients = ingList.map((s) => ({ name: s, quantity: '' }));

  if (!name && ingredients.length === 0 && !instrText) return null;

  const res: RecipeFormValues = {
    name: name || '',
    cuisine: cuisineGuess || '',
    ingredients: ingredients.length ? ingredients : [{ name: '', quantity: '' }],
    instructions: instrText || '',
    dietary_tags: tags,
    notes: '',
    images,
  };
  return res;
}

export function parseRecipeFromText(text: string): RecipeFormValues | null {
  // Try JSON first
  try {
    const json = JSON.parse(text);
    const parsed = parseRecipeFromLD(json);
    if (parsed) return parsed;
  } catch {
    // not JSON, continue
  }

  // Try HTML with JSON-LD
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')) as HTMLScriptElement[];
    for (const s of scripts) {
      try {
        if (!s.textContent) continue;
        const obj = JSON.parse(s.textContent);
        const parsed = parseRecipeFromLD(obj);
        if (parsed) return parsed;
      } catch {
        continue;
      }
    }

    // Heuristic fallback on HTML content
    const heuristic = parseHeuristic(text);
    if (heuristic) return heuristic;
  } catch {
    // fallthrough
  }

  return null;
}

export function buildAlternativeFetchUrl(targetUrl: string): string | null {
  try {
    const u = new URL(targetUrl);
    // Use jina.ai reader mirror which often allows CORS: https://r.jina.ai/https://example.com/path
    return `https://r.jina.ai/${u.protocol}//${u.host}${u.pathname}${u.search}`;
  } catch {
    return null;
  }
}
