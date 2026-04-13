import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { getUserMemberships, addBulletin } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'announcement', label: 'Announcement', icon: 'megaphone-outline' },
  { id: 'event', label: 'Event', icon: 'calendar-outline' },
  { id: 'funding', label: 'Funding', icon: 'cash-outline' },
  { id: 'volunteer', label: 'Volunteer', icon: 'heart-outline' },
  { id: 'training', label: 'Training', icon: 'school-outline' },
];

const PRIORITIES = [
  { id: 'high', label: 'High', color: '#D32F2F' },
  { id: 'medium', label: 'Medium', color: '#F9A825' },
  { id: 'low', label: 'Low', color: '#4CAF50' },
];

export default function CreateBulletinScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const userMemberships = getUserMemberships(currentUser);
  const officerClubs = userMemberships.filter((m) => m.role !== 'Member');

  const [selectedClub, setSelectedClub] = useState(officerClubs[0]?.club || null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('announcement');
  const [priority, setPriority] = useState('medium');
  const [pinned, setPinned] = useState(false);

  const canPost = title.trim().length > 0 && body.trim().length > 0 && selectedClub;

  const handlePost = () => {
    if (!canPost) {
      Alert.alert('Missing Info', 'Please fill in the title and body.');
      return;
    }

    const newBulletin = {
      id: 'b' + Date.now(),
      title: title.trim(),
      body: body.trim(),
      author: currentUser.name,
      authorId: currentUser.id,
      clubId: selectedClub.id,
      category,
      date: new Date().toISOString().split('T')[0],
      priority,
      pinned,
      likes: 0,
      comments: 0,
    };

    addBulletin(newBulletin);
    Alert.alert('Posted!', 'Your bulletin has been published.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Bulletin</Text>
        <TouchableOpacity
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={!canPost}
        >
          <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Club Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Posting as</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clubRow}
          >
            {officerClubs.map((m) => (
              <TouchableOpacity
                key={m.clubId}
                style={[
                  styles.clubChip,
                  selectedClub?.id === m.club.id && styles.clubChipActive,
                ]}
                onPress={() => setSelectedClub(m.club)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: m.club.logo }} style={styles.clubChipLogo} />
                <View>
                  <Text
                    style={[
                      styles.clubChipName,
                      selectedClub?.id === m.club.id && styles.clubChipNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {m.club.name}
                  </Text>
                  <Text style={styles.clubChipRole}>{m.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Title *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="What's this about?"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />
          <Text style={styles.charCount}>{title.length}/120</Text>
        </View>

        {/* Body */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Details *</Text>
          <TextInput
            style={styles.bodyInput}
            placeholder="Share the details. You can include dates, locations, links, requirements..."
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.optionsRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={category === cat.id ? colors.white : colors.darkGold}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat.id && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.priorityChip,
                  priority === p.id && { backgroundColor: p.color },
                ]}
                onPress={() => setPriority(p.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priority === p.id ? colors.white : p.color },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    priority === p.id && styles.priorityTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pin Toggle */}
        <TouchableOpacity
          style={styles.pinRow}
          onPress={() => setPinned(!pinned)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={pinned ? 'pin' : 'pin-outline'}
            size={22}
            color={pinned ? colors.darkGold : colors.textMuted}
          />
          <View style={styles.pinInfo}>
            <Text style={styles.pinLabel}>Pin this bulletin</Text>
            <Text style={styles.pinDesc}>Pinned bulletins appear at the top of the board</Text>
          </View>
          <View style={[styles.toggle, pinned && styles.toggleActive]}>
            <View style={[styles.toggleDot, pinned && styles.toggleDotActive]} />
          </View>
        </TouchableOpacity>

        {/* Preview */}
        {title.trim().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Preview</Text>
            <View style={styles.previewCard}>
              {pinned && (
                <View style={styles.previewPinned}>
                  <Ionicons name="pin" size={10} color={colors.white} />
                  <Text style={styles.previewPinnedText}>Pinned</Text>
                </View>
              )}
              <View style={styles.previewHeader}>
                <Image source={{ uri: selectedClub?.logo }} style={styles.previewAvatar} />
                <View>
                  <Text style={styles.previewAuthor}>{currentUser.name}</Text>
                  <Text style={styles.previewClub}>{selectedClub?.name}</Text>
                </View>
              </View>
              <Text style={styles.previewTitle}>{title}</Text>
              {body.trim().length > 0 && (
                <Text style={styles.previewBody} numberOfLines={3}>{body}</Text>
              )}
            </View>
          </View>
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
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  postButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  postButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGold,
  },
  postButtonTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clubRow: {
    gap: 10,
  },
  clubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 10,
    minWidth: 160,
  },
  clubChipActive: {
    borderColor: colors.darkGold,
    backgroundColor: colors.lightGold,
  },
  clubChipLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  clubChipName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clubChipNameActive: {
    color: colors.darkGold,
    fontWeight: '700',
  },
  clubChipRole: {
    fontSize: 11,
    color: colors.textMuted,
  },
  titleInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  bodyInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.border,
    lineHeight: 22,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.darkGold,
    borderColor: colors.darkGold,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priorityTextActive: {
    color: colors.white,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  pinInfo: {
    flex: 1,
  },
  pinLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pinDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: colors.darkGold,
  },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  previewPinned: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGold,
    paddingHorizontal: 10,
    paddingVertical: 3,
    gap: 4,
  },
  previewPinnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: 0,
    gap: 10,
  },
  previewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  previewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  previewClub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginTop: 8,
  },
  previewBody: {
    fontSize: 13,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    marginTop: 4,
    lineHeight: 18,
  },
});
