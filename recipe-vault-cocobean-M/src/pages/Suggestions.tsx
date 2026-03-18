import { useState } from 'react';
import { Layout } from '../components/Layout';
import { fetchSuggestions, SuggestionRequest, SuggestedRecipeDTO, generateLocalSuggestions } from '../lib/llm';
import { useRecipesStore } from '../store/recipes';
import { HOSTED_SUGGESTIONS_ENDPOINT } from '../lib/config';

export default function Suggestions() {
  const add = useRecipesStore((s) => s.addRecipe);

  const [ingredients, setIngredients] = useState<string>('');
  const [cuisine, setCuisine] = useState('');
  const [dietary, setDietary] = useState('');
  const [flexibility, setFlexibility] = useState<'strict' | 'flexible'>('flexible');
  const [count, setCount] = useState<number>(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SuggestedRecipeDTO[]>([]);

  async function handleSuggest() {
    setError(null);
    setResults([]);
    const req: SuggestionRequest = {
      ingredients: ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      cuisine: cuisine.trim() || undefined,
      dietary: dietary
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      flexibility,
      count,
    };

    setLoading(true);
    try {
      if (HOSTED_SUGGESTIONS_ENDPOINT) {
        const resp = await fetchSuggestions(req);
        setResults(resp.recipes || []);
      } else {
        const resp = generateLocalSuggestions(req);
        setResults(resp.recipes);
        setError('Using offline demo suggestions (no server).');
      }
    } catch (e: any) {
      const resp = generateLocalSuggestions(req);
      setResults(resp.recipes);
      setError('Using offline demo suggestions (no server).');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="LLM Recipe Suggestions">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Available ingredients</label>
            <input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken, rice, tomato, onion"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <p className="text-xs text-slate-500">Comma-separated list</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Cuisine (optional)</label>
              <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Italian, Indian, etc." className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Dietary (optional)</label>
              <input value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="vegan, gluten-free" className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <p className="text-xs text-slate-500">Comma-separated</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Flexibility</label>
              <select value={flexibility} onChange={(e) => setFlexibility(e.target.value as any)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="strict">Strict (only provided)</option>
                <option value="flexible">Flexible (allow additions)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Number of recipes</label>
              <input type="number" min={1} max={10} value={count} onChange={(e) => setCount(parseInt(e.target.value || '5', 10))} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSuggest} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">{loading ? 'Generating…' : 'Get Suggestions'}</button>
            <button onClick={() => setResults([])} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">Clear</button>
          </div>
          {error && <div className="p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">{error}</div>}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="font-medium">Results</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r, idx) => (
                <SuggestionCard key={idx} recipe={r} onSave={() => {
                  const saved = add({
                    name: r.name,
                    cuisine: r.cuisine || '',
                    ingredients: r.ingredients.map((i) => ({ name: i.name, quantity: i.quantity || '' })),
                    instructions: r.instructions_summary,
                    dietary_tags: r.dietary_tags || [],
                    notes: r.substitutions && r.substitutions.length ? `Substitutions: \n- ${r.substitutions.join('\n- ')}` : '',
                    images: [],
                  });
                  alert('Saved to your vault.');
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function SuggestionCard({ recipe, onSave }: { recipe: SuggestedRecipeDTO; onSave: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold">{recipe.name}</div>
          <div className={`text-xs inline-flex items-center px-2 py-0.5 rounded-full ${recipe.match === 'exact' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{recipe.match === 'exact' ? 'Exact match' : 'Partial match'}</div>
        </div>
        {recipe.cuisine && <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{recipe.cuisine}</div>}
      </div>
      <div>
        <div className="text-sm font-medium mb-1">Key ingredients</div>
        <div className="flex flex-wrap gap-1">
          {recipe.ingredients.slice(0, 6).map((i, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">{i.name}{i.quantity ? ` — ${i.quantity}` : ''}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-1">Summary</div>
        <p className="text-sm text-slate-700 line-clamp-5">{recipe.instructions_summary}</p>
      </div>
      {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.dietary_tags.map((t, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{t}</span>
          ))}
        </div>
      )}
      {recipe.substitutions && recipe.substitutions.length > 0 && (
        <div className="text-xs text-slate-500">Substitutions: {recipe.substitutions.join('; ')}</div>
      )}
      <div className="flex items-center justify-end">
        <button onClick={onSave} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Save to vault</button>
      </div>
    </div>
  );
}
