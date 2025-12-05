import React, { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-12 mb-4">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
              <span className="text-4xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                user?.role === "admin"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {user?.role === "admin" ? "Administrateur" : "Employé"}
            </span>
            <span className="text-gray-500 text-sm">
              Membre depuis{" "}
              {new Date(user?.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sécurité
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "notifications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <input
                  type="text"
                  value={user?.role === "admin" ? "Administrateur" : "Employé"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={() => toast.info("Fonctionnalité à venir")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Modifier mes informations
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Changer le mot de passe
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Assurez-vous d'utiliser un mot de passe fort et unique.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  onClick={() => toast.info("Fonctionnalité à venir")}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Mettre à jour
                </button>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-600 mb-2">
                  Zone de danger
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Une fois votre compte supprimé, toutes vos données seront
                  perdues.
                </p>
                <button
                  onClick={() => toast.error("Fonctionnalité désactivée")}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Notifications par email
                  </h3>
                  <p className="text-sm text-gray-500">
                    Recevoir des emails pour les nouvelles réservations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">Rappels</h3>
                  <p className="text-sm text-gray-500">
                    Recevoir un rappel 30 minutes avant une réunion
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">Annulations</h3>
                  <p className="text-sm text-gray-500">
                    Être notifié quand une réservation est annulée
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
