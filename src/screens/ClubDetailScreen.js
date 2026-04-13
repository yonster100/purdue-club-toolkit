import React from 'react';
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
import { colors, spacing, borderRadius } from '../theme';
import { events } from '../data/mockData';

export default function ClubDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { club } = route.params;
  const clubEvents = events.filter((e) => e.clubId === club.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Club Hero */}
        <View style={styles.heroCard}>
          <Image source={{ uri: club.logo }} style={styles.heroLogo} />
          <Text style={styles.heroName}>{club.name}</Text>
          <Text style={styles.heroCategory}>{club.category}</Text>
          <Text style={styles.heroDescription}>{club.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{club.memberCount}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{club.upcomingEvents}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
            <Text style={styles.joinButtonText}>Join Club</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {clubEvents.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming events</Text>
          ) : (
            clubEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <Text style={styles.eventMonth}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={styles.eventDay}>{new Date(event.date).getDate()}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>
                    <Ionicons name="time-outline" size={12} /> {event.time}
                  </Text>
                  <Text style={styles.eventMeta}>
                    <Ionicons name="location-outline" size={12} /> {event.location}
                  </Text>
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                </View>
              </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.gold,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroCategory: {
    fontSize: 14,
    color: colors.darkGold,
    fontWeight: '600',
    marginTop: 4,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  joinButton: {
    backgroundColor: colors.darkGold,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
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
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  eventMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gold,
  },
  eventDay: {
    fontSize: 22,
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
  },
  eventMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  eventDescription: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
});
