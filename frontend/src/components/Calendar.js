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

const Calendar = ({
  reservations,
  onSelectEvent,
  onSelectSlot,
  selectable = false,
}) => {
  const events = reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.title} - ${reservation.room_name}`,
    start: new Date(reservation.start_time),
    end: new Date(reservation.end_time),
    resource: reservation,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
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
                    .dark .rbc-header {
                        color: #e5e7eb;
                        background: #374151;
                        border-bottom: 1px solid #4b5563 !important;
                    }
                    .rbc-month-view {
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .dark .rbc-month-view {
                        border: 1px solid #4b5563;
                    }
                    .rbc-day-bg {
                        transition: background-color 0.2s;
                    }
                    .rbc-day-bg:hover {
                        background-color: #f3f4f6;
                    }
                    .dark .rbc-day-bg:hover {
                        background-color: #374151;
                    }
                    .rbc-today {
                        background-color: #eff6ff !important;
                    }
                    .dark .rbc-today {
                        background-color: #1e3a5f !important;
                    }
                    .rbc-off-range-bg {
                        background-color: #f9fafb;
                    }
                    .dark .rbc-off-range-bg {
                        background-color: #1f2937;
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
                        color: #374151 !important;
                        border: 1px solid #e5e7eb !important;
                        border-radius: 8px !important;
                        padding: 8px 16px !important;
                        font-weight: 500 !important;
                        transition: all 0.2s !important;
                        background: white !important;
                    }
                    .dark .rbc-toolbar button {
                        color: #e5e7eb !important;
                        border: 1px solid #4b5563 !important;
                        background: #374151 !important;
                    }
                    .rbc-toolbar button:hover {
                        background-color: #f3f4f6 !important;
                        border-color: #d1d5db !important;
                    }
                    .dark .rbc-toolbar button:hover {
                        background-color: #4b5563 !important;
                        border-color: #6b7280 !important;
                    }
                    .rbc-toolbar button.rbc-active {
                        background: linear-gradient(to right, #3b82f6, #6366f1) !important;
                        color: white !important;
                        border-color: transparent !important;
                    }
                    .rbc-toolbar button.rbc-active:hover {
                        background: linear-gradient(to right, #2563eb, #4f46e5) !important;
                    }
                    .rbc-toolbar-label {
                        font-weight: 600;
                        font-size: 1.1rem;
                        color: #374151;
                    }
                    .dark .rbc-toolbar-label {
                        color: #e5e7eb;
                    }
                    .rbc-date-cell {
                        padding: 8px;
                        text-align: right;
                    }
                    .rbc-date-cell > a {
                        color: #374151;
                        font-weight: 500;
                    }
                    .dark .rbc-date-cell > a {
                        color: #e5e7eb;
                    }
                    .rbc-off-range .rbc-date-cell > a,
                    .rbc-off-range a {
                        color: #9ca3af;
                    }
                    .dark .rbc-off-range .rbc-date-cell > a,
                    .dark .rbc-off-range a {
                        color: #6b7280;
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
                    .dark .rbc-agenda-view table.rbc-agenda-table {
                        border: 1px solid #4b5563;
                    }
                    .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
                        background: #f9fafb;
                        padding: 12px;
                        font-weight: 600;
                        color: #374151;
                    }
                    .dark .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
                        background: #374151;
                        color: #e5e7eb;
                    }
                    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
                        padding: 12px;
                        border-top: 1px solid #e5e7eb;
                        color: #374151;
                    }
                    .dark .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
                        border-top: 1px solid #4b5563;
                        color: #e5e7eb;
                    }
                    .rbc-month-row {
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .dark .rbc-month-row {
                        border-bottom: 1px solid #4b5563;
                    }
                    .rbc-day-slot .rbc-time-slot {
                        border-top: 1px solid #e5e7eb;
                    }
                    .dark .rbc-day-slot .rbc-time-slot {
                        border-top: 1px solid #4b5563;
                    }
                    .rbc-timeslot-group {
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .dark .rbc-timeslot-group {
                        border-bottom: 1px solid #4b5563;
                    }
                    .rbc-time-view {
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .dark .rbc-time-view {
                        border: 1px solid #4b5563;
                    }
                    .rbc-time-header-content {
                        border-left: 1px solid #e5e7eb;
                    }
                    .dark .rbc-time-header-content {
                        border-left: 1px solid #4b5563;
                    }
                    .rbc-time-content {
                        border-top: 1px solid #e5e7eb;
                    }
                    .dark .rbc-time-content {
                        border-top: 1px solid #4b5563;
                    }
                    .rbc-time-gutter {
                        color: #6b7280;
                    }
                    .dark .rbc-time-gutter {
                        color: #9ca3af;
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
        onSelectEvent={(event) =>
          onSelectEvent && onSelectEvent(event.resource)
        }
        onSelectSlot={(slotInfo) => onSelectSlot && onSelectSlot(slotInfo)}
        selectable={selectable}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
      />
    </div>
  );
};

export default Calendar;
