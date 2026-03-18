import { useState } from 'react';
import { Layout } from '../components/Layout';
import { parseRecipeFromText, buildAlternativeFetchUrl } from '../lib/recipeImport';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipesStore } from '../store/recipes';
import { useNavigate } from 'react-router-dom';

export default function ImportRecipe() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<any | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [html, setHtml] = useState('');
  const [showHow, setShowHow] = useState(false);
  const add = useRecipesStore((s) => s.addRecipe);
  const navigate = useNavigate();

  async function tryFetch(u: string): Promise<string | null> {
    try {
      const res = await fetch(u, { mode: 'cors' });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  async function handleImport() {
    setError(null);
    setParsed(null);
    const u = url.trim();
    if (!u) {
      setError('Please enter a URL');
      return;
    }
    let finalUrl = u;
    try {
      finalUrl = new URL(u).toString();
    } catch {
      setError('Please enter a valid URL (including https://)');
      return;
    }

    setLoading(true);
    try {
      // 1) Try direct
      let text = await tryFetch(finalUrl);
      // 2) Try a public read mirror (r.jina.ai) that often allows CORS
      if (!text) {
        const alt = buildAlternativeFetchUrl(finalUrl);
        if (alt) text = await tryFetch(alt);
      }

      if (!text) {
        setError('Unable to load this URL in the browser. Many sites block it (CORS). Use Paste HTML below.');
        return;
      }
      const values = parseRecipeFromText(text);
      if (!values) {
        setError("We couldn't parse a recipe from that page. Try Paste HTML.");
        return;
      }
      setParsed(values);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Import from URL">
      {!parsed ? (
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Recipe URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-favorite-recipe"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-sm">{error}</div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={handleImport} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? 'Importing…' : 'Import'}
            </button>
            <div className="relative">
              <button onClick={() => setShowPaste((v) => !v)} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                {showPaste ? 'Hide Paste HTML' : 'Paste HTML'}
              </button>
              <button
                title="How to copy HTML"
                onClick={() => setShowHow((v) => !v)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center border border-slate-300 hover:bg-slate-300"
              >
                ?
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500">Note: Browsers block loading many sites directly (CORS). If Import fails, use Paste HTML.</p>

          {showHow && <HowToCopy />}

          {showPaste && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Paste full page HTML</label>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={8}
                placeholder="Paste the page HTML here (View Source → copy all)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setError(null);
                    const values = parseRecipeFromText(html);
                    if (!values) {
                      setError("We couldn't parse a recipe from the pasted HTML.");
                      return;
                    }
                    setParsed(values);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Parse Pasted HTML
                </button>
              </div>
              <p className="text-xs text-slate-500">This runs entirely in your browser. No data is sent to a server.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm">
            Preview the imported recipe. You can edit any field before saving.
          </div>
          <RecipeForm
            defaultValues={{
              name: parsed.name,
              cuisine: parsed.cuisine,
              ingredients: parsed.ingredients,
              instructions: parsed.instructions,
              dietary_tags: parsed.dietary_tags,
              notes: parsed.notes,
              images: parsed.images,
            }}
            onSubmit={(values) => {
              const r = add(values);
              navigate(`/recipe/${r.id}`);
            }}
            submitLabel="Save Imported Recipe"
          />
        </div>
      )}
    </Layout>
  );
}

function HowToCopy() {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm space-y-2">
      <div className="font-medium">How to copy page HTML</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <div className="text-slate-600 font-medium">Desktop (Chrome/Edge)</div>
          <ol className="list-decimal pl-5 space-y-1 mt-1">
            <li>Open the recipe page.</li>
            <li>Right click → View page source (or press Ctrl/Cmd+U).</li>
            <li>Select all (Ctrl/Cmd+A), copy (Ctrl/Cmd+C).</li>
            <li>Paste here and click Parse Pasted HTML.</li>
          </ol>
        </div>
        <div>
          <div className="text-slate-600 font-medium">Desktop (Firefox/Safari)</div>
          <ol className="list-decimal pl-5 space-y-1 mt-1">
            <li>Open the recipe page.</li>
            <li>Menu → View Page Source (or press Ctrl/Cmd+U).</li>
            <li>Select all, copy, and paste here.</li>
          </ol>
        </div>
        <div>
          <div className="text-slate-600 font-medium">Mobile</div>
          <ol className="list-decimal pl-5 space-y-1 mt-1">
            <li>Use the Share menu → Copy Link.</li>
            <li>Open the link on a desktop browser and follow steps above.</li>
            <li>Alternatively, save the page as .html and send it to your computer.</li>
          </ol>
        </div>
        <div>
          <div className="text-slate-600 font-medium">Tip: JSON-LD</div>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>If the page has Recipe JSON-LD, parsing is very accurate.</li>
            <li>Otherwise, we use smart heuristics to extract ingredients and steps.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
