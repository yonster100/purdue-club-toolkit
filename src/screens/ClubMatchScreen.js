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
import { colors, spacing, borderRadius } from '../theme';
import { clubs, interests, getUserMemberships } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const InterestChip = ({ interest, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.interestChip, selected && styles.interestChipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.interestIcon, selected && styles.interestIconSelected]}>
      <Ionicons
        name={interest.icon}
        size={28}
        color={selected ? colors.white : colors.darkGold}
      />
    </View>
    <Text style={[styles.interestLabel, selected && styles.interestLabelSelected]}>
      {interest.name}
    </Text>
  </TouchableOpacity>
);

const ClubCard = ({ club, showNotification }) => (
  <View style={styles.clubCard}>
    <Image source={{ uri: club.logo }} style={styles.clubLogo} />
    <View style={styles.clubInfo}>
      <Text style={styles.clubName}>{club.name}</Text>
      {showNotification ? (
        <View style={styles.notificationRow}>
          <Ionicons name="notifications-outline" size={14} color={colors.textMuted} />
          <Text style={styles.notificationText}>No New Notifications!</Text>
        </View>
      ) : null}
    </View>
  </View>
);

const RecommendationCard = ({ club, matchedInterests }) => (
  <View style={styles.recommendationCard}>
    <Image source={{ uri: club.logo }} style={styles.recLogo} />
    <View style={styles.recInfo}>
      <Text style={styles.recName}>{club.name}</Text>
      <Text style={styles.recMatch}>
        Based on your interests in:{'\n'}
        <Text style={styles.recInterests}>{matchedInterests.join(', ')}</Text>
      </Text>
      <TouchableOpacity>
        <Text style={styles.viewClubLink}>View club information</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ClubMatchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const userMemberships = getUserMemberships(currentUser);
  const [selectedInterests, setSelectedInterests] = useState(['Engineering']);
  const [showAllInterests, setShowAllInterests] = useState(false);

  const toggleInterest = (name) => {
    setSelectedInterests((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const visibleInterests = showAllInterests ? interests : interests.slice(0, 6);
  const myClubs = userMemberships.map((m) => m.club);

  const recommendations = clubs
    .filter((club) => !userMemberships.some((m) => m.clubId === club.id))
    .filter((club) =>
      selectedInterests.some(
        (interest) =>
          club.category.toLowerCase().includes(interest.toLowerCase()) ||
          club.description.toLowerCase().includes(interest.toLowerCase())
      )
    )
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.brandLogo}>P</Text>
          <View>
            <Text style={styles.brandTitle}>PURDUE</Text>
            <Text style={styles.brandSubtitle}>UNIVERSITY</Text>
            <Text style={styles.brandAppName}>Club Match</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Your Interests</Text>
            <TouchableOpacity onPress={() => setShowAllInterests(!showAllInterests)}>
              <Text style={styles.showAllText}>
                {showAllInterests ? 'Show Less' : 'Show All'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.interestsGrid}>
            {visibleInterests.map((interest) => (
              <InterestChip
                key={interest.id}
                interest={interest}
                selected={selectedInterests.includes(interest.name)}
                onPress={() => toggleInterest(interest.name)}
              />
            ))}
          </View>
        </View>

        {/* Current Clubs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Clubs</Text>
            <TouchableOpacity>
              <Text style={styles.showAllText}>Show All</Text>
            </TouchableOpacity>
          </View>
          {myClubs.map((club) => (
            <ClubCard key={club.id} club={club} showNotification />
          ))}
        </View>

        {/* Top Club Matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Club Matches</Text>
            <TouchableOpacity>
              <Text style={styles.showAllText}>Show All</Text>
            </TouchableOpacity>
          </View>
          {recommendations.length === 0 ? (
            <View style={styles.noMatches}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={styles.noMatchesText}>
                Select interests above to see club recommendations
              </Text>
            </View>
          ) : (
            recommendations.map((club) => (
              <RecommendationCard
                key={club.id}
                club={club}
                matchedInterests={currentUser.interests.filter((i) =>
                  club.description.toLowerCase().includes(i.toLowerCase()) ||
                  club.category.toLowerCase().includes(i.toLowerCase())
                ).slice(0, 4)}
              />
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.gold,
    fontStyle: 'italic',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 2,
  },
  brandAppName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    fontStyle: 'italic',
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  showAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGold,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  interestChipSelected: {},
  interestIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  interestIconSelected: {
    backgroundColor: colors.darkGold,
    borderColor: colors.darkGold,
  },
  interestLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  interestLabelSelected: {
    color: colors.darkGold,
    fontWeight: '700',
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clubLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  notificationText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  recInfo: {
    flex: 1,
  },
  recName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recMatch: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  recInterests: {
    fontStyle: 'italic',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  viewClubLink: {
    fontSize: 13,
    color: colors.darkGold,
    fontWeight: '600',
    marginTop: 6,
    fontStyle: 'italic',
  },
  noMatches: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noMatchesText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
