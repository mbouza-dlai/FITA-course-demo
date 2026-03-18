import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecipesStore } from '../store/recipes';
import { RecipeCard } from '../components/RecipeCard';
import { Layout } from '../components/Layout';

export default function Home() {
  const recipes = useRecipesStore((s) => s.recipes);
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');

  const cuisines = useMemo(() => {
    const set = new Set(recipes.map((r) => r.cuisine).filter(Boolean));
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = cuisine.trim().toLowerCase();

    return recipes.filter((r) => {
      const cuisineMatch = !c || (r.cuisine || '').toLowerCase().includes(c);
      if (!q) return cuisineMatch;
      const inName = r.name.toLowerCase().includes(q);
      const inIngredients = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
      const inTags = r.dietary_tags?.some((t) => t.toLowerCase().includes(q));
      return cuisineMatch && (inName || inIngredients || inTags);
    });
  }, [recipes, query, cuisine]);

  return (
    <Layout title="Your Recipes" actions={
      <div className="flex items-center gap-2">
        <Link to="/import" className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">Import from URL</Link>
        <Link to="/add" className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm">+ Add Recipe</Link>
      </div>
    }>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ingredient, or tag"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-3">No recipes yet.</p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/import" className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">Import from URL</Link>
            <Link to="/add" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Create your first recipe</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </Layout>
  );
}
