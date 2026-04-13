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
import { getUserMemberships, interests as allInterests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={24} color={colors.darkGold} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SettingsRow = ({ icon, label, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color={colors.darkGold} />
    <Text style={styles.settingsLabel}>{label}</Text>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, signOut } = useAuth();
  const userMemberships = getUserMemberships(currentUser);
  const userInterests = allInterests.filter((i) =>
    currentUser.interests.some((ui) => ui.toLowerCase().includes(i.name.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
          <View style={styles.profileBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentUser.year}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentUser.major}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Clubs" value={userMemberships.length} />
          <StatCard icon="calendar" label="Events" value="8" />
          <StatCard icon="star" label="Positions" value="1" />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          <View style={styles.interestsGrid}>
            {currentUser.interests.map((interest, idx) => (
              <View key={idx} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* My Clubs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Clubs</Text>
          {userMemberships.map((membership) => (
            <View key={membership.clubId} style={styles.clubRow}>
              <Image source={{ uri: membership.club.logo }} style={styles.clubLogo} />
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{membership.club.name}</Text>
                <Text style={styles.clubRole}>{membership.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingsRow icon="notifications-outline" label="Notifications" />
            <SettingsRow icon="lock-closed-outline" label="Privacy" />
            <SettingsRow icon="color-palette-outline" label="Appearance" />
            <SettingsRow icon="help-circle-outline" label="Help & Support" />
            <SettingsRow icon="information-circle-outline" label="About" />
            <SettingsRow icon="log-out-outline" label="Sign Out" showChevron={false} onPress={signOut} />
          </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: -10,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.gold,
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  },
  badge: {
    backgroundColor: colors.lightGold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGold,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 10,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
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
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clubLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clubRole: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
