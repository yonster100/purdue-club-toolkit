import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, borderRadius } from '../theme';
import { events, getClubById } from '../data/mockData';

const EventCard = ({ event }) => {
  const club = getClubById(event.clubId);
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventDateBadge}>
        <Text style={styles.eventMonth}>
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
        </Text>
        <Text style={styles.eventDay}>
          {new Date(event.date).getDate()}
        </Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.eventMetaText}>{event.time}</Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.eventMetaText}>{event.location}</Text>
        </View>
        {club && (
          <View style={styles.eventClubRow}>
            <Image source={{ uri: club.logo }} style={styles.eventClubLogo} />
            <Text style={styles.eventClubName}>{club.name}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState('');

  const markedDates = {};
  events.forEach((event) => {
    markedDates[event.date] = {
      marked: true,
      dotColor: colors.darkGold,
      ...(selectedDate === event.date
        ? { selected: true, selectedColor: colors.darkGold }
        : {}),
    };
  });

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.darkGold,
    };
  }

  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Ionicons name="calendar" size={24} color={colors.white} />
        <Text style={styles.headerTitle}>Club Events</Text>
        <TouchableOpacity onPress={() => setSelectedDate('')}>
          <Text style={styles.showAllBtn}>Show All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.white,
              calendarBackground: colors.white,
              todayTextColor: colors.darkGold,
              selectedDayBackgroundColor: colors.darkGold,
              selectedDayTextColor: colors.white,
              arrowColor: colors.darkGold,
              monthTextColor: colors.textPrimary,
              textDayFontWeight: '500',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
              dotColor: colors.darkGold,
              selectedDotColor: colors.white,
            }}
          />
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.eventsHeader}>
            {selectedDate
              ? `Events on ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}`
              : 'Upcoming Events'}
          </Text>

          {filteredEvents.length === 0 ? (
            <View style={styles.noEvents}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={styles.noEventsText}>No events on this date</Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.darkGold,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
  },
  showAllBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gold,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventsSection: {
    paddingHorizontal: spacing.md,
  },
  eventsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventDateBadge: {
    backgroundColor: colors.darkGold,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  eventMonth: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
  },
  eventDay: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  eventInfo: {
    flex: 1,
    padding: spacing.md,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  eventMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  eventClubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  eventClubLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  eventClubName: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  noEvents: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
