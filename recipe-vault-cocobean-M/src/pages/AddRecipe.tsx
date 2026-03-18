import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipesStore } from '../store/recipes';

export default function AddRecipe() {
  const add = useRecipesStore((s) => s.addRecipe);
  const navigate = useNavigate();

  return (
    <Layout
      title="Add Recipe"
      // Add action button to import
      actions={<Link to="/import" className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">Import from URL</Link>}
    >
      <RecipeForm
        onSubmit={(values) => {
          const recipe = add({
            name: values.name,
            cuisine: values.cuisine || '',
            ingredients: values.ingredients,
            instructions: values.instructions,
            dietary_tags: values.dietary_tags || [],
            notes: values.notes || '',
            images: values.images || [],
          });
          navigate(`/recipe/${recipe.id}`);
        }}
        submitLabel="Create Recipe"
      />
    </Layout>
  );
}
