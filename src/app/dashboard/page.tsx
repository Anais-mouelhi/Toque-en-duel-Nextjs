'use client';

import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../utils/authOptions";
import { signOut } from "next-auth/react";

const Dashboard = async () => {
  // Vérification de la session serveur
  const session = await getServerSession(authOptions);

  console.log("Session côté serveur:", session);

  if (!session) {
    redirect("/"); // Redirige vers la page d'accueil si la session est absente
    return null; // Ajout de return pour éviter des erreurs de rendu
  }

  // Composant client avec un état local
  return <DashboardContent session={session} />;
};

interface DashboardContentProps {
  session: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ session }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/recipes/history");
        if (!res.ok) throw new Error("Erreur de récupération de l'historique");
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="hidden md:flex gap-4 items-center justify-end flex-1">
      <div>
        <span>Welcome, {session.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 ml-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
