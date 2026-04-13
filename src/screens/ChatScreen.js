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
import { chatMessages, clubs, getUserMemberships, getClubById } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function enrichMessage(msg) {
  return { ...msg, club: getClubById(msg.clubId) };
}

const TextMessage = ({ message }) => (
  <View style={styles.messageCard}>
    <Image source={{ uri: message.club.logo }} style={styles.messageAvatar} />
    <View style={styles.messageContent}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  </View>
);

const PollMessage = ({ message }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const totalVotes = message.pollOptions.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <View style={styles.messageCard}>
      <Image source={{ uri: message.club.logo }} style={styles.messageAvatar} />
      <View style={styles.pollContent}>
        <Text style={styles.pollLabel}>Poll:</Text>
        <Text style={styles.pollQuestion}>{message.text}</Text>
        <View style={styles.pollOptions}>
          {message.pollOptions.map((option) => {
            const percentage = Math.round((option.votes / totalVotes) * 100);
            const isSelected = selectedOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.pollOptionButton,
                  isSelected && styles.pollOptionSelected,
                ]}
                onPress={() => setSelectedOption(option.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.pollOptionFill,
                    { width: `${percentage}%` },
                    isSelected && styles.pollOptionFillSelected,
                  ]}
                />
                <Text style={[styles.pollOptionText, isSelected && styles.pollOptionTextSelected]}>
                  {option.text} - {option.votes} votes
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.pollMeta}>
          <View style={styles.pollEndDateWrapper}>
            <Text style={styles.pollEndDate}>Poll ends {message.pollEnds}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const TaggedMessage = ({ message }) => (
  <View style={styles.taggedMessageCard}>
    <View style={[styles.tagBadge, { backgroundColor: message.tag.color }]}>
      <Text style={styles.tagText}>{message.tag.label}</Text>
    </View>
    <Text style={styles.taggedMessageText}>{message.text}</Text>
  </View>
);

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();

  const myClubIds = currentUser.memberships.map((m) => m.clubId);
  const myMessages = chatMessages
    .filter((m) => myClubIds.includes(m.clubId))
    .map(enrichMessage);
  const textMessages = myMessages.filter((m) => m.type === 'text');
  const pollMessages = myMessages.filter((m) => m.type === 'poll');
  const taggedMessages = myMessages.filter((m) => m.type === 'tagged');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Image source={{ uri: currentUser.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.welcomeName}>{currentUser.name}</Text>
        </View>
        <View style={styles.headerBranding}>
          <Text style={styles.brandLogo}>P</Text>
          <View>
            <Text style={styles.brandTitle}>PURDUE</Text>
            <Text style={styles.brandSubtitle}>UNIVERSITY</Text>
            <Text style={styles.brandAppName}>ClubChat</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={styles.sectionTitle}>Your Chats</Text>

        {textMessages.map((msg) => (
          <TextMessage key={msg.id} message={msg} />
        ))}

        {pollMessages.map((msg) => (
          <PollMessage key={msg.id} message={msg} />
        ))}

        {/* Tagged Messages Group */}
        {taggedMessages.length > 0 && (
          <View style={styles.taggedGroup}>
            <View style={styles.taggedGroupHeader}>
              <Image
                source={{ uri: taggedMessages[0].club.logo }}
                style={styles.taggedGroupAvatar}
              />
            </View>
            {taggedMessages.map((msg) => (
              <TaggedMessage key={msg.id} message={msg} />
            ))}
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
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  headerTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  headerBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.gold,
    fontStyle: 'italic',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 7,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 2,
  },
  brandAppName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  messageCard: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  messageContent: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  pollContent: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  pollLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGold,
    marginBottom: 4,
  },
  pollQuestion: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  pollOptions: {
    gap: 8,
  },
  pollOptionButton: {
    backgroundColor: colors.lightGold,
    borderRadius: borderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  pollOptionSelected: {
    borderWidth: 2,
    borderColor: colors.darkGold,
  },
  pollOptionFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.gold,
    borderRadius: borderRadius.xl,
    opacity: 0.3,
  },
  pollOptionFillSelected: {
    opacity: 0.5,
  },
  pollOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  pollOptionTextSelected: {
    color: colors.darkGold,
    fontWeight: '700',
  },
  pollMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  pollEndDateWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  pollEndDate: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  taggedGroup: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  taggedGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  taggedGroupAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  taggedMessageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingLeft: 4,
    gap: spacing.sm,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  taggedMessageText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    paddingTop: 4,
  },
});
