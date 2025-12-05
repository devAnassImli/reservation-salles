import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { roomService, reservationService } from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsRes, reservationsRes] = await Promise.all([
        roomService.getAll(),
        reservationService.getMyReservations(),
      ]);
      setRooms(roomsRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const upcomingReservations = reservations
    .filter((r) => new Date(r.start_time) > new Date())
    .slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <svg
            className="animate-spin h-12 w-12 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bienvenue sur votre tableau de bord RoomBook
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Salles</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rooms.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Mes réservations
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {reservations.length}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">À venir</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {upcomingReservations.length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <p className="text-lg font-bold text-emerald-600 mt-1 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                En ligne
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/reservations"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Nouvelle réservation
              </h3>
              <p className="text-blue-100">
                Réservez une salle pour votre prochaine réunion
              </p>
            </div>
            <svg
              className="w-8 h-8 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </Link>
        <Link
          to="/calendar"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Voir le calendrier</h3>
              <p className="text-emerald-100">
                Consultez toutes les réservations
              </p>
            </div>
            <svg
              className="w-8 h-8 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Prochaines réservations
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Vos 5 prochaines réunions
            </p>
          </div>
          <Link
            to="/reservations"
            className="text-blue-600 font-medium hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {upcomingReservations.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500">Aucune réservation à venir</p>
            <Link
              to="/reservations"
              className="mt-4 inline-block text-blue-600 font-medium hover:underline"
            >
              Créer une réservation
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {upcomingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {reservation.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.room_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {new Date(reservation.start_time).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(reservation.start_time).toLocaleTimeString(
                        "fr-FR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                      {" - "}
                      {new Date(reservation.end_time).toLocaleTimeString(
                        "fr-FR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
