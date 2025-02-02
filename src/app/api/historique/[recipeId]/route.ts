import { NextApiRequest, NextApiResponse } from 'next'; 
import connect from '@/utils/db'; 
import mongoose from "mongoose";

// Schéma et modèle Historique
const historiqueSchema = new mongoose.Schema({
  recipeId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Historique = mongoose.models.Historique || mongoose.model('Historique', historiqueSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { recipeId } = req.query;

    try {
      console.log('Tentative de connexion à la base de données...');
      await connect();  // Connexion à MongoDB avec Mongoose
      console.log('Connexion réussie à la base de données.');

      // Créer un document pour l'historique
      const historique = new Historique({
        recipeId,
        date: new Date(),
      });

      const result = await historique.save(); // Enregistrer le document
      console.log('Résultat de l\'insertion:', result);

      if (result._id) {
        return res.status(200).json({ message: 'Recette ajoutée à l\'historique' });
      } else {
        return res.status(500).json({ message: 'Erreur lors de l\'ajout à l\'historique' });
      }
    } catch (error) {
      console.error('Erreur dans la gestion de la requête API:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
