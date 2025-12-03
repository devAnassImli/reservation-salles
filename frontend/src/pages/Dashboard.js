import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { roomService, reservationService } from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form states
  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    equipment: "",
  });
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

  // Gestion des salles (admin)
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.create(roomForm);
      toast.success("Salle créée avec succès");
      setShowRoomModal(false);
      setRoomForm({ name: "", capacity: "", equipment: "" });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Supprimer cette salle ?")) {
      try {
        await roomService.delete(id);
        toast.success("Salle supprimée");
        loadData();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  // Gestion des réservations
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      await reservationService.create(reservationForm);
      toast.success("Réservation créée avec succès");
      setShowReservationModal(false);
      setReservationForm({ roomId: "", title: "", startTime: "", endTime: "" });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la réservation"
      );
    }
  };

  const handleDeleteReservation = async (id) => {
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

  const openReservationModal = (room) => {
    setSelectedRoom(room);
    setReservationForm({ ...reservationForm, roomId: room.id });
    setShowReservationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Réservation de Salles</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Salles */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Salles disponibles</h2>
            {isAdmin && (
              <button
                onClick={() => setShowRoomModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                + Ajouter une salle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-gray-600">
                  Capacité: {room.capacity} personnes
                </p>
                <p className="text-gray-600">
                  Équipement: {room.equipment || "Aucun"}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openReservationModal(room)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Réserver
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Mes Réservations */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Mes réservations</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-600">Aucune réservation</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Salle</th>
                    <th className="px-4 py-2 text-left">Titre</th>
                    <th className="px-4 py-2 text-left">Début</th>
                    <th className="px-4 py-2 text-left">Fin</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-t">
                      <td className="px-4 py-2">{reservation.room_name}</td>
                      <td className="px-4 py-2">{reservation.title}</td>
                      <td className="px-4 py-2">
                        {new Date(reservation.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(reservation.end_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() =>
                            handleDeleteReservation(reservation.id)
                          }
                          className="text-red-500 hover:underline"
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modal Création Salle */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle salle</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={roomForm.name}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Capacité</label>
                <input
                  type="number"
                  value={roomForm.capacity}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, capacity: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Équipement</label>
                <input
                  type="text"
                  value={roomForm.equipment}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, equipment: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Réservation */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Réserver: {selectedRoom?.name}
            </h2>
            <form onSubmit={handleCreateReservation}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={reservationForm.title}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Début</label>
                <input
                  type="datetime-local"
                  value={reservationForm.startTime}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Fin</label>
                <input
                  type="datetime-local"
                  value={reservationForm.endTime}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Réserver
                </button>
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
