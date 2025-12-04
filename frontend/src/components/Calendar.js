import React from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
  allDay: "Journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucune réservation sur cette période",
  showMore: (total) => `+ ${total} de plus`,
};

const Calendar = ({ reservations, onSelectEvent }) => {
  const events = reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.title} - ${reservation.room_name}`,
    start: new Date(reservation.start_time),
    end: new Date(reservation.end_time),
    resource: reservation,
  }));

  const eventStyleGetter = (event) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-cyan-500 to-blue-600",
    ];
    const colorIndex = event.id % colors.length;

    return {
      style: {
        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
        borderRadius: "8px",
        border: "none",
        color: "white",
        padding: "2px 8px",
      },
      className: `bg-gradient-to-r ${colors[colorIndex]}`,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <style>
        {`
                    .rbc-calendar {
                        font-family: inherit;
                    }
                    .rbc-header {
                        padding: 12px 8px;
                        font-weight: 600;
                        color: #374151;
                        background: #f9fafb;
                        border-bottom: 1px solid #e5e7eb !important;
                    }
                    .rbc-month-view {
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .rbc-day-bg {
                        transition: background-color 0.2s;
                    }
                    .rbc-day-bg:hover {
                        background-color: #f3f4f6;
                    }
                    .rbc-today {
                        background-color: #eff6ff !important;
                    }
                    .rbc-off-range-bg {
                        background-color: #f9fafb;
                    }
                    .rbc-event {
                        background: linear-gradient(to right, #3b82f6, #6366f1) !important;
                        border: none !important;
                        border-radius: 6px !important;
                        padding: 2px 8px !important;
                        font-size: 12px;
                        font-weight: 500;
                    }
                    .rbc-event:hover {
                        opacity: 0.9;
                        transform: scale(1.02);
                    }
                    .rbc-toolbar {
                        margin-bottom: 20px;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    .rbc-toolbar button {
                        color: #374151;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 8px 16px;
                        font-weight: 500;
                        transition: all 0.2s;
                    }
                    .rbc-toolbar button:hover {
                        background-color: #f3f4f6;
                        border-color: #d1d5db;
                    }
                    .rbc-toolbar button.rbc-active {
                        background: linear-gradient(to right, #3b82f6, #6366f1);
                        color: white;
                        border-color: transparent;
                    }
                    .rbc-toolbar button.rbc-active:hover {
                        background: linear-gradient(to right, #2563eb, #4f46e5);
                    }
                    .rbc-date-cell {
                        padding: 8px;
                        text-align: right;
                    }
                    .rbc-date-cell > a {
                        color: #374151;
                        font-weight: 500;
                    }
                    .rbc-show-more {
                        color: #3b82f6;
                        font-weight: 600;
                        margin-top: 4px;
                    }
                    .rbc-agenda-view table.rbc-agenda-table {
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
                        background: #f9fafb;
                        padding: 12px;
                        font-weight: 600;
                        color: #374151;
                    }
                    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
                        padding: 12px;
                        border-top: 1px solid #e5e7eb;
                    }
                `}
      </style>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={messages}
        culture="fr"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) =>
          onSelectEvent && onSelectEvent(event.resource)
        }
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
      />
    </div>
  );
};

export default Calendar;
