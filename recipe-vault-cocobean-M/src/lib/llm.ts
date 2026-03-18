import { HOSTED_SUGGESTIONS_ENDPOINT, SUPABASE_ANON_KEY } from './config';

export interface SuggestionRequest {
  ingredients: string[];
  cuisine?: string;
  dietary?: string[];
  flexibility: 'strict' | 'flexible';
  count?: number;
}

export interface SuggestedRecipeDTO {
  name: string;
  ingredients: { name: string; quantity?: string }[];
  instructions_summary: string;
  cuisine?: string;
  dietary_tags?: string[];
  match: 'exact' | 'partial';
  substitutions?: string[];
}

export interface SuggestionResponse {
  recipes: SuggestedRecipeDTO[];
}

export function buildPrompt(input: SuggestionRequest) {
  const { ingredients, cuisine, dietary, flexibility, count } = input;
  const reqCount = count && count > 0 && count <= 10 ? count : 5;
  return `You are a culinary assistant. Generate ${reqCount} unique recipe ideas as JSON only (no prose), following this schema:\n{\n  \"recipes\": [\n    {\n      \"name\": \"string\",\n      \"ingredients\": [{\"name\": \"string\", \"quantity\": \"string (optional)\"}],\n      \"instructions_summary\": \"3-6 concise steps in one paragraph\",\n      \"cuisine\": \"string (optional)\",\n      \"dietary_tags\": [\"string\"],\n      \"match\": \"exact|partial\",\n      \"substitutions\": [\"string\"]\n    }\n  ]\n}\nRules:\n- Ingredients must ${flexibility === 'strict' ? 'use only the provided list' : 'prioritize provided ingredients; allow reasonable additions if needed'}.\n- Mark match as \"exact\" only if all main ingredients match the provided list; otherwise \"partial\".\n- If flexibility is flexible, include 1-3 substitutions notes for alternatives.\n- Avoid allergens if dietary restrictions imply it.\n- Keep names enticing but realistic.\n- Do not include markdown.\n\nInputs:\n- Provided ingredients: ${ingredients.join(', ') || '(none)'}\n- Preferred cuisine: ${cuisine || '(none)'}\n- Dietary restrictions: ${dietary?.join(', ') || '(none)'}\n- Flexibility: ${flexibility}\n`;
}

function buildSupabaseAltEndpoint(endpoint: string): string | null {
  try {
    const u = new URL(endpoint);
    const isRestPath = u.hostname.endsWith('.supabase.co') && u.pathname.startsWith('/functions/v1/');
    if (!isRestPath) return null;
    const projectRef = u.hostname.split('.supabase.co')[0];
    const fnPath = u.pathname.replace('/functions/v1', '');
    return `https://${projectRef}.functions.supabase.co${fnPath}`;
  } catch {
    return null;
  }
}

function tryParseEmbeddedContent(obj: any): SuggestionResponse | null {
  try {
    const content = obj?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') return null;
    // Extract JSON from content (in case of stray text)
    const match = content.match(/\{[\s\S]*\}$/);
    const jsonText = match ? match[0] : content;
    const parsed = JSON.parse(jsonText);
    if (parsed && Array.isArray(parsed.recipes)) return parsed as SuggestionResponse;
    return null;
  } catch {
    return null;
  }
}

async function doFetch(endpoint: string, input: SuggestionRequest): Promise<SuggestionResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (SUPABASE_ANON_KEY) {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
    headers['apikey'] = SUPABASE_ANON_KEY;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Suggestions error ${res.status}: ${text}`);
  }
  const data = await res.json();

  // Accept either our clean shape { recipes: [...] } or a raw OpenAI response
  if (data && Array.isArray((data as any).recipes)) {
    return data as SuggestionResponse;
  }

  const parsed = tryParseEmbeddedContent(data);
  if (parsed) return parsed;

  throw new Error('Invalid suggestions response');
}

export function getConfiguredEndpoint(): string | null {
  return HOSTED_SUGGESTIONS_ENDPOINT || null;
}

export async function fetchSuggestions(input: SuggestionRequest): Promise<SuggestionResponse> {
  const endpoint = getConfiguredEndpoint();
  if (!endpoint) throw new Error('No suggestions endpoint configured');

  try {
    return await doFetch(endpoint, input);
  } catch (e) {
    const alt = buildSupabaseAltEndpoint(endpoint);
    if (alt) {
      return await doFetch(alt, input);
    }
    throw e;
  }
}

// Local demo generator (no API needed). Not an LLM, but gives reasonable suggestions for demos.
export function generateLocalSuggestions(input: SuggestionRequest): SuggestionResponse {
  const pantry = ['salt', 'pepper', 'olive oil', 'garlic'];
  const baseIngs = input.ingredients.map((s) => s.toLowerCase());
  const n = Math.min(Math.max(input.count || 5, 1), 10);
  const results: SuggestedRecipeDTO[] = [];

  const titleize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  for (let i = 0; i < n; i++) {
    const mains = baseIngs.slice(0, 3 + (i % 2));
    const extras = input.flexibility === 'flexible' ? pantry.slice(0, 1 + (i % 3)) : [];
    const all = [...mains, ...extras];
    const nameParts = mains.slice(0, 2).map(titleize);
    const cuisine = input.cuisine || ['Global', 'Fusion', 'Home Style'][i % 3];
    const name = `${nameParts.join(' & ')} ${['Skillet', 'Bowl', 'Bake', 'Stir-Fry'][i % 4]}`.trim();

    const steps = [
      `Prep ingredients: chop ${mains.join(', ')}${extras.length ? `; gather ${extras.join(', ')}` : ''}.`,
      `Heat pan with${extras.includes('olive oil') ? '' : ' a little'} olive oil; sauté aromatics if available.`,
      `Add main ingredients; season with salt and pepper; cook until tender.`,
      input.flexibility === 'flexible'
        ? `Adjust with substitutions as needed; consider swapping one item for a similar ingredient.`
        : `Stick to provided ingredients for a clean, simple flavor.`,
      `Serve warm.`,
    ];

    const match: 'exact' | 'partial' = extras.length === 0 ? 'exact' : 'partial';

    results.push({
      name,
      ingredients: all.map((a) => ({ name: a })),
      instructions_summary: steps.join(' '),
      cuisine,
      dietary_tags: input.dietary || [],
      match,
      substitutions:
        input.flexibility === 'flexible'
          ? [
              `Swap ${mains[0] || 'protein'} with tofu or beans for a plant-based option`,
              `Use herbs on hand in place of specialty spices`,
            ]
          : [],
    });
  }

  return { recipes: results };
}
