import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  roomService,
  reservationService,
  auditService,
  departmentService,
} from "../services/api";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const Admin = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalReservations: 0,
    todayReservations: 0,
  });
  const [allReservations, setAllReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [
        roomsRes,
        reservationsRes,
        departmentsRes,
        auditRes,
        typesRes,
        equipmentsRes,
      ] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        departmentService.getAll(),
        auditService.getAll(20, 0),
        roomService.getTypes(),
        roomService.getEquipments(),
      ]);

      const rooms = roomsRes.data;
      const reservations = reservationsRes.data;

      // Calculer les réservations d'aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayReservations = reservations.filter((r) => {
        const resDate = new Date(r.start_time);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      });

      setRooms(rooms);
      setAllReservations(reservations);
      setDepartments(departmentsRes.data);
      setAuditLogs(auditRes.data);
      setRoomTypes(typesRes.data);
      setEquipments(equipmentsRes.data);
      setStats({
        totalRooms: rooms.length,
        totalReservations: reservations.length,
        todayReservations: todayReservations.length,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm("Supprimer cette réservation ?")) {
      try {
        await reservationService.delete(id);
        toast.success("Réservation supprimée");
        loadData();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  // Rediriger si non admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

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
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-500">Gérez l'ensemble de l'application</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Salles</p>
              <p className="text-3xl font-bold mt-1">{stats.totalRooms}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg
                className="w-6 h-6"
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

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Total Réservations
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalReservations}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg
                className="w-6 h-6"
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

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Aujourd'hui</p>
              <p className="text-3xl font-bold mt-1">
                {stats.todayReservations}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg
                className="w-6 h-6"
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

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Taux occupation
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalRooms > 0
                  ? Math.round(
                      (stats.todayReservations / stats.totalRooms) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "reservations"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Réservations
            </button>
            <button
              onClick={() => setActiveTab("rooms")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "rooms"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Salles
            </button>
            <button
              onClick={() => setActiveTab("departments")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "departments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Départements
            </button>
            <button
              onClick={() => setActiveTab("roomTypes")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "roomTypes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Types de salles
            </button>
            <button
              onClick={() => setActiveTab("equipments")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "equipments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Équipements
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "audit"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Logs d'audit
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique réservations par jour */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Réservations cette semaine
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={(() => {
                        const days = [
                          "Dim",
                          "Lun",
                          "Mar",
                          "Mer",
                          "Jeu",
                          "Ven",
                          "Sam",
                        ];
                        const today = new Date();
                        const weekData = [];
                        for (let i = 6; i >= 0; i--) {
                          const date = new Date(today);
                          date.setDate(date.getDate() - i);
                          const dayReservations = allReservations.filter(
                            (r) => {
                              const resDate = new Date(r.start_time);
                              return (
                                resDate.toDateString() === date.toDateString()
                              );
                            }
                          ).length;
                          weekData.push({
                            name: days[date.getDay()],
                            reservations: dayReservations,
                          });
                        }
                        return weekData;
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar
                        dataKey="reservations"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graphique répartition par salle */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Répartition par salle
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={rooms
                          .map((room) => ({
                            name: room.name,
                            value: allReservations.filter(
                              (r) => r.room_name === room.name
                            ).length,
                          }))
                          .filter((r) => r.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {rooms.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [
                                "#3b82f6",
                                "#10b981",
                                "#8b5cf6",
                                "#f59e0b",
                                "#ef4444",
                                "#06b6d4",
                              ][index % 6]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activité récente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Activité récente
                </h3>
                {allReservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune activité récente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allReservations.slice(0, 5).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                          <div>
                            <p className="font-medium text-gray-900">
                              {reservation.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {reservation.room_name} • {reservation.user_name}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(reservation.start_time).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Salles les plus utilisées */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Salles les plus utilisées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rooms.slice(0, 3).map((room, index) => {
                    const roomReservations = allReservations.filter(
                      (r) => r.room_name === room.name
                    );
                    const percentage =
                      allReservations.length > 0
                        ? Math.round(
                            (roomReservations.length / allReservations.length) *
                              100
                          )
                        : 0;
                    return (
                      <div key={room.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            {room.name}
                          </h4>
                          <span
                            className={`text-lg font-bold ${
                              index === 0
                                ? "text-blue-600"
                                : index === 1
                                ? "text-emerald-600"
                                : "text-purple-600"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {roomReservations.length}
                        </p>
                        <p className="text-sm text-gray-500">
                          réservations ({percentage}%)
                        </p>
                        <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-emerald-500"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div>
              {allReservations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune réservation
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Titre
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Salle
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Utilisateur
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Horaire
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allReservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {reservation.title}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {reservation.room_name}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {reservation.user_name}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(
                              reservation.start_time
                            ).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(
                              reservation.start_time
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(reservation.end_time).toLocaleTimeString(
                              "fr-FR",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() =>
                                handleDeleteReservation(reservation.id)
                              }
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const roomReservations = allReservations.filter(
                  (r) => r.room_name === room.name
                );
                return (
                  <div key={room.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {room.name}
                      </h4>
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        {room.capacity} pers.
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {room.equipment || "Aucun équipement"}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {roomReservations.length} réservations
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              (roomReservations.length /
                                Math.max(allReservations.length, 1)) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Départements
            </h3>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {departments.length} départements
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                </div>
                <p className="text-sm text-gray-500">
                  {dept.description || "Aucune description"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Types Tab */}
      {activeTab === "roomTypes" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Types de salles
            </h3>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {roomTypes.length} types
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((type) => (
              <div key={type.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: type.color + "20" }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color }}
                    ></div>
                  </div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-500">
                  {type.description || "Aucune description"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipments Tab */}
      {activeTab === "equipments" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Équipements</h3>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              {equipments.length} équipements
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipments.map((equip) => (
              <div key={equip.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{equip.name}</h4>
                    <p className="text-xs text-gray-500">
                      {equip.description || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Logs d'audit
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              Dernières actions
            </span>
          </div>
          {auditLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun log d'audit</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Utilisateur
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Entité
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {log.user_name || "Système"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === "CREATE"
                              ? "bg-green-100 text-green-600"
                              : log.action === "UPDATE"
                              ? "bg-blue-100 text-blue-600"
                              : log.action === "DELETE"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.entity_type} #{log.entity_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {log.ip_address || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Admin;
