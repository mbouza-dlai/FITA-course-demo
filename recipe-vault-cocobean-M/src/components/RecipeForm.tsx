import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeInput } from '../types';

const imageUrl = z.union([z.string().url('Must be a valid URL'), z.string().trim().length(0)]);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  cuisine: z.string().optional().default(''),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, 'Ingredient name required'),
        quantity: z.string().optional().default(''),
      })
    )
    .min(1, 'At least one ingredient'),
  instructions: z.string().min(1, 'Instructions required'),
  dietary_tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(''),
  images: z.array(imageUrl).optional().default([]),
});

export type RecipeFormValues = z.infer<typeof schema>;

interface RecipeFormProps {
  defaultValues?: Partial<RecipeFormValues>;
  onSubmit: (values: RecipeInput) => void;
  submitLabel?: string;
}

export function RecipeForm({ defaultValues, onSubmit, submitLabel = 'Save Recipe' }: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful, submitCount },
    reset,
    setFocus,
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      defaultValues ?? {
        name: '',
        cuisine: '',
        ingredients: [{ name: '', quantity: '' }],
        instructions: '',
        dietary_tags: [],
        notes: '',
        images: [],
      },
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues as RecipeFormValues);
  }, [defaultValues, reset]);

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: 'ingredients' });
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: 'dietary_tags' });

  const onInvalid = () => {
    if (errors.name) return setFocus('name');
    if (errors.ingredients?.[0]?.name) return setFocus('ingredients.0.name');
    if (errors.instructions) return setFocus('instructions');
    if (errors.images?.[0]) return setFocus('images.0');
  };

  const errorSummary = useMemo(() => {
    const msgs: string[] = [];
    if (errors.name?.message) msgs.push(String(errors.name.message));
    if (errors.ingredients?.message && typeof errors.ingredients.message === 'string') msgs.push(errors.ingredients.message);
    if (errors.instructions?.message) msgs.push(String(errors.instructions.message));
    // show first image error only
    const firstImgErr = errors.images && Array.isArray(errors.images) ? errors.images.find(Boolean) : undefined as any;
    if (firstImgErr?.message) msgs.push(String(firstImgErr.message));
    return msgs;
  }, [errors]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // sanitize before submit
        const cleaned: RecipeInput = {
          name: values.name.trim(),
          cuisine: (values.cuisine || '').trim(),
          ingredients: values.ingredients
            .filter((i) => i && i.name && i.name.trim().length > 0)
            .map((i) => ({ name: i.name.trim(), quantity: (i.quantity || '').trim() })),
          instructions: values.instructions.trim(),
          dietary_tags: (values.dietary_tags || []).map((t) => t.trim()).filter(Boolean),
          images: (values.images || []).map((u) => u.trim()).filter(Boolean),
          notes: (values.notes || '').trim(),
        };
        console.log('Submitting recipe', cleaned);
        onSubmit(cleaned);
      }, onInvalid)}
      className="space-y-6"
    >
      {submitCount > 0 && errorSummary.length > 0 && (
        <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
          <div className="font-medium mb-1">Please fix the following:</div>
          <ul className="list-disc pl-5 text-sm space-y-0.5">
            {errorSummary.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <input
            {...register('name')}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g., Spaghetti Bolognese"
          />
          {errors.name && <p className="text-sm text-rose-600">{errors.name.message as string}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Cuisine</label>
          <input
            {...register('cuisine')}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g., Italian"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ingredients</label>
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-6 sm:col-span-7">
                <input
                  {...register(`ingredients.${index}.name` as const)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Name"
                />
                {errors.ingredients?.[index]?.name && (
                  <p className="mt-1 text-sm text-rose-600">{errors.ingredients[index]?.name?.message as string}</p>
                )}
              </div>
              <div className="col-span-5 sm:col-span-4">
                <input
                  {...register(`ingredients.${index}.quantity` as const)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Quantity"
                />
              </div>
              <div className="col-span-1">
                <button type="button" onClick={() => removeIngredient(index)} className="w-full px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => appendIngredient({ name: '', quantity: '' })} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">
            + Add ingredient
          </button>
        </div>
        {typeof errors.ingredients?.message === 'string' && (
          <p className="text-sm text-rose-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Instructions</label>
        <textarea
          {...register('instructions')}
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Step-by-step instructions"
        />
        {errors.instructions && <p className="text-sm text-rose-600">{errors.instructions.message as string}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dietary tags</label>
        <div className="space-y-3">
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  {...register(`dietary_tags.${index}` as const)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Vegan, Gluten-free"
                />
              </div>
              <button type="button" onClick={() => removeTag(index)} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendTag('')} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">
            + Add tag
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URLs</label>
        <div className="space-y-3">
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  {...register(`images.${index}` as const)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="https://example.com/image.jpg"
                />
                {Array.isArray(errors.images) && errors.images[index]?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.images[index]?.message as string}</p>
                )}
              </div>
              <button type="button" onClick={() => removeImage(index)} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendImage('')} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">
            + Add image
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Additional tips, serving suggestions, etc."
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
