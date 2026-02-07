<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  locale: { type: String, default: 'zh-TW' },
  t: { type: Function, required: true }
})

const emit = defineEmits(['edit'])

const priorityColors = {
  high: { backgroundColor: '#EF4444', borderColor: '#DC2626' },
  medium: { backgroundColor: '#F59E0B', borderColor: '#D97706' },
  low: { backgroundColor: '#10B981', borderColor: '#059669' }
}

const events = computed(() => {
  return props.tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.startDate,
    end: task.endDate,
    allDay: false,
    ...priorityColors[task.priority],
    extendedProps: { task }
  }))
})

const fcLocale = computed(() => {
  return props.locale === 'ja' ? 'ja' : 'zh-tw'
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: fcLocale.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  buttonText: {
    today: props.t('calendar.today'),
    month: props.t('calendar.month'),
    week: props.t('calendar.week'),
    day: props.t('calendar.day')
  },
  events: events.value,
  editable: false,
  selectable: true,
  dayMaxEvents: true,
  eventClick: handleEventClick,
  height: 'auto',
  aspectRatio: 1.8
}))

function handleEventClick(info) {
  emit('edit', info.event.extendedProps.task)
}
</script>

<style>
/* FullCalendar Dark Mode Styles */
.dark .calendar-wrapper .fc {
  --fc-border-color: #374151;
  --fc-page-bg-color: #1f2937;
  --fc-neutral-bg-color: #374151;
  --fc-list-event-hover-bg-color: #374151;
  --fc-today-bg-color: rgba(239, 68, 68, 0.1);
}

.dark .calendar-wrapper .fc .fc-col-header-cell-cushion,
.dark .calendar-wrapper .fc .fc-daygrid-day-number,
.dark .calendar-wrapper .fc .fc-toolbar-title {
  color: #f3f4f6;
}

.dark .calendar-wrapper .fc .fc-button {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.dark .calendar-wrapper .fc .fc-button:hover {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark .calendar-wrapper .fc .fc-button-active {
  background-color: #ef4444 !important;
  border-color: #dc2626 !important;
}

.dark .calendar-wrapper .fc .fc-daygrid-day {
  background-color: #1f2937;
}

.dark .calendar-wrapper .fc .fc-day-today {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

.dark .calendar-wrapper .fc .fc-scrollgrid {
  border-color: #374151;
}

.dark .calendar-wrapper .fc th,
.dark .calendar-wrapper .fc td {
  border-color: #374151;
}

.dark .calendar-wrapper .fc .fc-day-other .fc-daygrid-day-number {
  color: #6b7280;
}
</style>
