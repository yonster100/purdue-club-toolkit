import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { resourceTools, getUserMemberships } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ResourceCard = ({ tool, onPress }) => {
  const iconMap = {
    'search': 'search-outline',
    'business': 'business-outline',
    'create': 'create-outline',
    'school': 'school-outline',
    'calendar': 'calendar-outline',
    'push-pin': 'pin-outline',
  };

  return (
    <TouchableOpacity style={styles.resourceCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.resourceIconContainer}>
        <Ionicons name={iconMap[tool.icon] || 'apps-outline'} size={32} color={colors.darkGold} />
      </View>
      <Text style={styles.resourceLabel} numberOfLines={2}>{tool.name}</Text>
    </TouchableOpacity>
  );
};

const ClubMembershipCard = ({ membership, onPress }) => (
  <TouchableOpacity style={styles.membershipCard} onPress={onPress} activeOpacity={0.7}>
    <Image source={{ uri: membership.club.logo }} style={styles.clubLogo} />
    <View style={styles.membershipInfo}>
      <Text style={styles.clubName}>{membership.club.name}</Text>
      <Text style={styles.clubRole}>{membership.role}</Text>
      <Text style={styles.upcomingEvents}>
        ({membership.club.upcomingEvents}) Upcoming Event{membership.club.upcomingEvents !== 1 ? 's' : ''}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTools, setShowAllTools] = useState(false);
  const visibleTools = showAllTools ? resourceTools : resourceTools.slice(0, 6);
  const userMemberships = getUserMemberships(currentUser);

  const handleToolPress = (tool) => {
    if (tool.screen === 'ClubMatch') {
      navigation.navigate('ClubMatch');
    } else if (tool.screen === 'Bulletins') {
      navigation.navigate('Bulletins');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.purdueLogo}>P</Text>
          <View>
            <Text style={styles.headerTitle}>PURDUE</Text>
            <Text style={styles.headerSubtitle}>UNIVERSITY</Text>
            <Text style={styles.headerAppName}>CLUB TOOLKIT</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userName}>{currentUser.name.toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.messagesButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="notifications" size={18} color={colors.darkGold} />
            <Text style={styles.messagesText}>MESSAGES ({currentUser.messageCount})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tools"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={22} color={colors.darkGold} style={styles.searchIcon} />
        </View>

        {/* Student Club Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Club Resources</Text>
            <TouchableOpacity onPress={() => setShowAllTools(!showAllTools)}>
              <Text style={styles.showAllText}>{showAllTools ? 'Show Less' : 'Show All'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resourceGrid}>
            {visibleTools.map((tool) => (
              <ResourceCard
                key={tool.id}
                tool={tool}
                onPress={() => handleToolPress(tool)}
              />
            ))}
          </View>
        </View>

        {/* Club Membership and Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club Membership and Positions</Text>
          {userMemberships.map((membership) => (
            <ClubMembershipCard
              key={membership.clubId}
              membership={membership}
              onPress={() => navigation.navigate('ClubDetail', { club: membership.club })}
            />
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  purdueLogo: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.gold,
    fontStyle: 'italic',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 3,
  },
  headerAppName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  messagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: 6,
    gap: 4,
  },
  messagesText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.darkGold,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
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
  },
  showAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGold,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resourceCard: {
    width: '30%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resourceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.lightGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
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
  membershipInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clubRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  upcomingEvents: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
