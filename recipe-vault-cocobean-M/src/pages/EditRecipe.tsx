import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RecipeForm, RecipeFormValues } from '../components/RecipeForm';
import { useRecipesStore } from '../store/recipes';

export default function EditRecipe() {
  const { id } = useParams();
  const get = useRecipesStore((s) => s.getRecipe);
  const update = useRecipesStore((s) => s.updateRecipe);
  const recipe = id ? get(id) : undefined;
  const navigate = useNavigate();

  if (!recipe) {
    return (
      <Layout title="Recipe Not Found">
        <p>We couldn't find that recipe.</p>
      </Layout>
    );
  }

  const defaults: Partial<RecipeFormValues> = {
    name: recipe.name,
    cuisine: recipe.cuisine,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    dietary_tags: recipe.dietary_tags,
    notes: recipe.notes,
    images: recipe.images,
  };

  return (
    <Layout title="Edit Recipe">
      <RecipeForm
        defaultValues={defaults}
        onSubmit={(values) => {
          update(recipe.id, values);
          navigate(`/recipe/${recipe.id}`);
        }}
        submitLabel="Update Recipe"
      />
    </Layout>
  );
}
