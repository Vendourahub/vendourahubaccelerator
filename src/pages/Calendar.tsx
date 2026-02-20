import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Clock, Video, Users, Target, BarChart3, FileText, AlertCircle } from "lucide-react";
import { getCurrentFounder } from "../lib/authManager";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline' | 'office-hours' | 'cohort-session' | 'personal';
  date: Date;
  time: string;
  description: string;
  link?: string;
  completed?: boolean;
  color: string;
}

export default function Calendar() {
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  // Load founder data
  useEffect(() => {
    const loadData = async () => {
      try {
        const founderData = await getCurrentFounder();
        setFounder(founderData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading founder data:", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate events for the week
  useEffect(() => {
    if (founder) {
      generateWeeklyEvents();
    }
  }, [founder, weekStart]);

  const generateWeeklyEvents = () => {
    const weekEvents: CalendarEvent[] = [];
    
    // Monday: Weekly Commit Deadline
    const monday = new Date(weekStart);
    weekEvents.push({
      id: 'commit-deadline',
      title: 'Weekly Commit Deadline',
      type: 'deadline',
      date: monday,
      time: '9:00 AM WAT',
      description: 'Submit your specific revenue action for this week',
      link: '/commit',
      color: 'bg-red-500'
    });

    // Wednesday: Office Hours
    const wednesday = new Date(weekStart);
    wednesday.setDate(wednesday.getDate() + 2);
    weekEvents.push({
      id: 'office-hours',
      title: 'Weekly Office Hours',
      type: 'office-hours',
      date: wednesday,
      time: '4:00 PM WAT',
      description: 'Drop-in session with mentors - Ask questions, get feedback',
      color: 'bg-blue-500'
    });

    // Friday: Revenue Report Deadline
    const friday = new Date(weekStart);
    friday.setDate(friday.getDate() + 4);
    weekEvents.push({
      id: 'report-deadline',
      title: 'Revenue Report Deadline',
      type: 'deadline',
      date: friday,
      time: '6:00 PM WAT',
      description: 'Submit your weekly revenue report with evidence',
      link: '/report',
      color: 'bg-red-500'
    });

    // Sunday: Review & Adjust Deadline
    const sunday = new Date(weekStart);
    sunday.setDate(sunday.getDate() + 6);
    weekEvents.push({
      id: 'adjust-deadline',
      title: 'Review & Adjust Deadline',
      type: 'deadline',
      date: sunday,
      time: '6:00 PM WAT',
      description: 'Complete your weekly review and set next week\'s plan',
      link: '/map',
      color: 'bg-red-500'
    });

    setEvents(weekEvents);
  };

  const goToToday = () => {
    const today = new Date();
    setWeekStart(getMonday(today));
    setSelectedDate(today);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const weekDays = getWeekDays();
  const selectedDateEvents = getEventsForDate(selectedDate);

  if (loading || !founder) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-600">{loading ? 'Loading calendar...' : 'Unable to load calendar. Please sign in again.'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-neutral-600">
            Week {founder.current_week || founder.currentWeek || 1} of 12 · All times in WAT (UTC+1)
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
        >
          Today
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {formatMonthYear(weekStart)}
            </h2>
          </div>
        </div>

        {/* Week Timeline View */}
        <div className="grid grid-cols-7 divide-x divide-neutral-200">
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isWeekend = index >= 5; // Saturday & Sunday
            const dayEvents = getEventsForDate(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-4 min-h-[140px] text-left transition-all hover:bg-neutral-50 ${
                  isSelected ? 'bg-blue-50 border-2 border-blue-500' : ''
                } ${isWeekend ? 'bg-neutral-50' : ''}`}
              >
                {/* Day Header */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-neutral-500 uppercase mb-1">
                    {formatDayName(day)}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isToday
                        ? 'w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center'
                        : isWeekend
                        ? 'text-neutral-400'
                        : 'text-neutral-900'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>

                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1.5 rounded ${event.color} text-white truncate`}
                    >
                      {event.time}
                    </div>
                  ))}
                </div>

                {isWeekend && (
                  <div className="text-xs text-neutral-400 mt-2">Rest Day</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Agenda for {formatFullDate(selectedDate)}
          </h2>
          {isSameDay(selectedDate, currentDate) && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              Today
            </span>
          )}
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No events scheduled for this day</p>
            {selectedDate.getDay() === 0 || selectedDate.getDay() === 6 ? (
              <p className="text-sm text-neutral-400 mt-2">Rest day - No activities</p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Critical Reminders */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-900 mb-2">Critical Deadlines</div>
            <div className="space-y-1 text-sm text-red-800">
              <div>• <strong>Monday 9:00 AM WAT:</strong> Weekly Commit submission</div>
              <div>• <strong>Friday 6:00 PM WAT:</strong> Revenue Report with evidence</div>
              <div>• <strong>Sunday 6:00 PM WAT:</strong> Review & Adjust submission</div>
            </div>
            <div className="mt-3 text-sm text-red-900 font-medium">
              Missing any deadline = immediate dashboard lock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  const content = (
    <div className={`p-6 border-l-4 ${event.color.replace('bg-', 'border-')} bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-all`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 ${event.color} text-white rounded-lg`}>
          {event.type === 'deadline' && <Target className="w-5 h-5" />}
          {event.type === 'office-hours' && <Users className="w-5 h-5" />}
          {event.type === 'cohort-session' && <Video className="w-5 h-5" />}
          {event.type === 'personal' && <FileText className="w-5 h-5" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg">{event.title}</h3>
            {event.type === 'deadline' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                DEADLINE
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          
          <p className="text-neutral-700 text-sm mb-3">{event.description}</p>
          
          {event.link && (
            <div className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Go to page →
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (event.link) {
    return <Link to={event.link}>{content}</Link>;
  }

  return content;
}

// Helper Functions
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
}