import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Recipe from "@/models/Recipe";

export async function GET(
  request: NextRequest, 
  { params }: { params: any } // Utiliser "any" pour contourner le problème de type
) {
  await dbConnect();

  try {
    const id = params.id as string; // Cast "id" comme chaîne de caractères
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }
    
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
}
