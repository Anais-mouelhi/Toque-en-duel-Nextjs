'use client';

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

interface Recipe {
  id: string;
  photo: string;
  titre: string;
  description: string;
  time?: string;
  portions?: string;
  ingredients: string[] | string;
  etapes: string[] | string;
}

async function fetchRecipeById(id: string): Promise<Recipe | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Recette non trouvée");
    }

    return res.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette :", error);
    return null;
  }
}

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await fetchRecipeById(id);
      setRecipe(data);
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    notFound();
    return null;
  }

  return (
    <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="flex basis-full lg:basis-1/2">
        <Image
          src={recipe.photo}
          alt={recipe.titre}
          width={1920}
          height={1287}
          className="object-cover"
          style={{ color: 'transparent' }}
        />
      </div>
      <div className="flex flex-col basis-full lg:basis-1/2 pl-0 lg:pl-12 pt-5 pb-10 bg-white">
        <div className="flex flex-wrap justify-start text-sm font-light space-x-5 py-5">
          <p className="px-4 py-3 bg-gray-100">Time: <span className="font-semibold">{recipe.time || '30 min'}</span></p>
          <p className="px-4 py-3 bg-gray-100">Portions: <span className="font-semibold">{recipe.portions || '6'}</span></p>
        </div>
        <h1 className="text-4xl font-bold pt-6 pb-3 text-left text-xl md:text-5xl text-gray-800">{recipe.titre}</h1>
        <div className="py-2 text-left">
          <p>{recipe.description || 'Description du plat...'}</p>
        </div>
        <h4 className="text-xl font-bold pt-3 pb-1.5 text-left uppercase mt-13 mb-0">Ingrédients:</h4>
        <ul className="space-y-1 list-disc list-inside ml-0">
          {Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index}>{ingredient}</li>
              ))
            : recipe.ingredients
                .split(",")
                .map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient.trim()}</li>
                ))}
        </ul>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Étapes de préparation</h2>
        <ol className="list-decimal list-inside text-gray-700 text-lg space-y-3">
          {Array.isArray(recipe.etapes)
            ? recipe.etapes.map((etape: string, index: number) => (
                <li key={index}>{etape}</li>
              ))
            : recipe.etapes
                .split(".")
                .map((etape: string, index: number) => (
                  <li key={index}>{etape.trim()}</li>
                ))}
        </ol>
      </div>
    </div>
  );
}
