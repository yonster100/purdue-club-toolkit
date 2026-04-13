import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { bulletins, getClubById, getUserMemberships } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'my_clubs', label: 'My Clubs' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'event', label: 'Events' },
  { id: 'funding', label: 'Funding' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'training', label: 'Training' },
];

const priorityColors = {
  high: '#D32F2F',
  medium: '#F9A825',
  low: '#4CAF50',
};

const categoryIcons = {
  announcement: 'megaphone-outline',
  event: 'calendar-outline',
  funding: 'cash-outline',
  volunteer: 'heart-outline',
  training: 'school-outline',
};

const BulletinCard = ({ bulletin, onPress }) => {
  const club = bulletin.clubId ? getClubById(bulletin.clubId) : null;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(bulletin.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <TouchableOpacity style={styles.bulletinCard} onPress={onPress} activeOpacity={0.7}>
      {bulletin.pinned && (
        <View style={styles.pinnedBanner}>
          <Ionicons name="pin" size={12} color={colors.white} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {club ? (
            <Image source={{ uri: club.logo }} style={styles.clubAvatar} />
          ) : (
            <View style={styles.officialAvatar}>
              <Ionicons name="shield-checkmark" size={20} color={colors.white} />
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{bulletin.author}</Text>
            <Text style={styles.postDate}>
              {new Date(bulletin.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColors[bulletin.priority] }]} />
          <View style={styles.categoryBadge}>
            <Ionicons
              name={categoryIcons[bulletin.category] || 'document-outline'}
              size={12}
              color={colors.darkGold}
            />
            <Text style={styles.categoryText}>
              {bulletin.category.charAt(0).toUpperCase() + bulletin.category.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {club && (
        <View style={styles.clubTag}>
          <Text style={styles.clubTagText}>{club.name}</Text>
        </View>
      )}

      <Text style={styles.bulletinTitle}>{bulletin.title}</Text>
      <Text style={styles.bulletinBody} numberOfLines={4}>
        {bulletin.body}
      </Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.footerAction} onPress={toggleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#D32F2F' : colors.textMuted}
          />
          <Text style={[styles.footerActionText, liked && { color: '#D32F2F' }]}>
            {likeCount}
          </Text>
        </TouchableOpacity>
        <View style={styles.footerAction}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
          <Text style={styles.footerActionText}>{bulletin.comments}</Text>
        </View>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="share-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="bookmark-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function BulletinsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const userMemberships = getUserMemberships(currentUser);
  const myClubIds = userMemberships.map((m) => m.clubId);

  const isOfficer = userMemberships.some(
    (m) => m.role !== 'Member'
  );

  const filteredBulletins = bulletins
    .filter((b) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'my_clubs') return b.clubId && myClubIds.includes(b.clubId);
      return b.category === activeFilter;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="pin" size={22} color={colors.gold} />
          <Text style={styles.headerTitle}>Bulletin Board</Text>
        </View>
        {isOfficer ? (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateBulletin')}
          >
            <Ionicons name="add" size={24} color={colors.darkGold} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bulletin Count */}
      <View style={styles.resultBar}>
        <Text style={styles.resultText}>
          {filteredBulletins.length} bulletin{filteredBulletins.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {filteredBulletins.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No bulletins match this filter</Text>
          </View>
        ) : (
          filteredBulletins.map((bulletin) => (
            <BulletinCard
              key={bulletin.id}
              bulletin={bulletin}
              onPress={() => navigation.navigate('BulletinDetail', { bulletin })}
            />
          ))
        )}
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
    paddingBottom: spacing.md,
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: colors.darkGold,
    paddingBottom: spacing.md,
  },
  filterScroll: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterChipActive: {
    backgroundColor: colors.gold,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  filterTextActive: {
    color: colors.darkGold,
    fontWeight: '700',
  },
  resultBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  bulletinCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    gap: 4,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
    paddingBottom: 0,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  clubAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  officialAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.darkGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  postDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.darkGold,
  },
  clubTag: {
    marginLeft: spacing.md,
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  clubTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A237E',
  },
  bulletinTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginTop: 10,
  },
  bulletinBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 20,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
