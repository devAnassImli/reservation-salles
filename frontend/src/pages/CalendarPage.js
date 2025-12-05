import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Calendar from "../components/Calendar";
import { reservationService } from "../services/api";
import { toast } from "react-toastify";

const CalendarPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationService.getAll();
      setReservations(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (reservation) => {
    setSelectedReservation(reservation);
  };

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Calendrier
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Visualisez toutes les réservations
        </p>
      </div>

      {/* Calendrier */}
      <Calendar reservations={reservations} onSelectEvent={handleSelectEvent} />

      {/* Modal détail réservation */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Détails de la réservation
              </h2>
            </div>
            <div className="p-6 space-y-4">
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
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedReservation.title}
                  </p>
                  <p className="text-gray-500">
                    {selectedReservation.room_name}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Réservé par:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedReservation.user_name}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  <span className="text-gray-600">
                    Début:{" "}
                    <span className="font-medium text-gray-900">
                      {new Date(selectedReservation.start_time).toLocaleString(
                        "fr-FR"
                      )}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  <span className="text-gray-600">
                    Fin:{" "}
                    <span className="font-medium text-gray-900">
                      {new Date(selectedReservation.end_time).toLocaleString(
                        "fr-FR"
                      )}
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReservation(null)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CalendarPage;
