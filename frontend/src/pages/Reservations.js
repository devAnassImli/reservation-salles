import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { reservationService, roomService } from "../services/api";
import { toast } from "react-toastify";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    roomId: "",
    title: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, roomsRes] = await Promise.all([
        reservationService.getMyReservations(),
        roomService.getAll(),
      ]);
      setReservations(reservationsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.create(reservationForm);
      toast.success("Réservation créée avec succès");
      setShowModal(false);
      setReservationForm({ roomId: "", title: "", startTime: "", endTime: "" });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la réservation"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      try {
        await reservationService.delete(id);
        toast.success("Réservation annulée");
        loadData();
      } catch (error) {
        toast.error("Erreur lors de l'annulation");
      }
    }
  };

  const getStatusColor = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now > end) {
      return { bg: "bg-gray-100", text: "text-gray-600", label: "Terminée" };
    } else if (now >= start && now <= end) {
      return { bg: "bg-green-100", text: "text-green-600", label: "En cours" };
    } else {
      return { bg: "bg-blue-100", text: "text-blue-600", label: "À venir" };
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes Réservations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos réservations de salles
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          <svg
            className="w-5 h-5"
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
          <span className="font-medium">Nouvelle réservation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {reservations.length}
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
                {
                  reservations.filter(
                    (r) => new Date(r.start_time) > new Date()
                  ).length
                }
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Terminées</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">
                {
                  reservations.filter((r) => new Date(r.end_time) < new Date())
                    .length
                }
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
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
          <p className="text-gray-500 text-lg">Aucune réservation</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Créer une première réservation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Salle
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Titre
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Début
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Fin
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  const status = getStatusColor(
                    reservation.start_time,
                    reservation.end_time
                  );
                  return (
                    <tr
                      key={reservation.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          {reservation.room_name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {reservation.title}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(reservation.start_time).toLocaleString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(reservation.end_time).toLocaleString("fr-FR")}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Nouvelle réservation
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salle
                </label>
                <select
                  value={reservationForm.roomId}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      roomId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une salle</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.capacity} pers.)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={reservationForm.title}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Réunion d'équipe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Début
                </label>
                <input
                  type="datetime-local"
                  value={reservationForm.startTime}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fin
                </label>
                <input
                  type="datetime-local"
                  value={reservationForm.endTime}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium"
                >
                  Réserver
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reservations;
