import { Link } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const cover = recipe.images?.[0];
  const keyIngredients = recipe.ingredients.slice(0, 3).map((i) => i.name).join(', ');

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-slate-100 overflow-hidden">
        {cover ? (
          <img src={cover} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{recipe.name}</h3>
          {recipe.cuisine && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{recipe.cuisine}</span>
          )}
        </div>
        <p className="mt-1 text-slate-600 text-sm line-clamp-2">{keyIngredients}</p>
        {recipe.dietary_tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.dietary_tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{tag}</span>
            ))}
            {recipe.dietary_tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">+{recipe.dietary_tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
