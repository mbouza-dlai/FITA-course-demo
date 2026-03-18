import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useRecipesStore } from '../store/recipes';

export default function ViewRecipe() {
  const { id } = useParams();
  const get = useRecipesStore((s) => s.getRecipe);
  const remove = useRecipesStore((s) => s.deleteRecipe);
  const recipe = id ? get(id) : undefined;
  const navigate = useNavigate();

  if (!recipe) {
    return (
      <Layout title="Recipe Not Found">
        <p>We couldn't find that recipe.</p>
      </Layout>
    );
  }

  return (
    <Layout
      title={recipe.name}
      actions={
        <div className="flex items-center gap-2">
          <Link to={`/edit/${recipe.id}`} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">Edit</Link>
          <button
            onClick={() => {
              const ok = confirm('Delete this recipe? This cannot be undone.');
              if (!ok) return;
              remove(recipe.id);
              navigate('/');
            }}
            className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-sm"
          >
            Delete
          </button>
        </div>
      }
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {recipe.images?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recipe.images.map((src, i) => (
                <div key={i} className="aspect-video bg-slate-100 overflow-hidden rounded-lg">
                  <img src={src} alt={recipe.name + ' image ' + (i + 1)} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div>
            <h2 className="font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-6 space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="font-medium">{ing.name}</span>
                  {ing.quantity && <span className="text-slate-600"> — {ing.quantity}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Instructions</h2>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
            </div>
          </div>
          {recipe.notes && (
            <div>
              <h2 className="font-semibold mb-2">Notes</h2>
              <p className="whitespace-pre-wrap text-slate-700">{recipe.notes}</p>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          {recipe.cuisine && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800">
              <div className="text-xs uppercase tracking-wide text-emerald-700">Cuisine</div>
              <div className="font-medium">{recipe.cuisine}</div>
            </div>
          )}
          {recipe.dietary_tags?.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs uppercase tracking-wide text-slate-500">Dietary</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {recipe.dietary_tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{tag}</span>
                ))}
              </div>
            </div>
          )}
          <div className="text-xs text-slate-500">
            <div>Created: {new Date(recipe.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(recipe.updatedAt).toLocaleString()}</div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
