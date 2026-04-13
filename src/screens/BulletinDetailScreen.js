import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { getClubById } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const priorityLabels = { high: 'High Priority', medium: 'Medium', low: 'Low Priority' };
const priorityColors = { high: '#D32F2F', medium: '#F9A825', low: '#4CAF50' };

export default function BulletinDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const { bulletin } = route.params;
  const club = bulletin.clubId ? getClubById(bulletin.clubId) : null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(bulletin.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 'dc1', author: 'Marcus Williams', text: 'This is great, thanks for sharing!', time: '2 hours ago' },
    { id: 'dc2', author: 'Sarah Chen', text: 'Will there be a virtual option?', time: '5 hours ago' },
  ]);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments([
      { id: 'dc' + Date.now(), author: currentUser.name, text: commentText.trim(), time: 'Just now' },
      ...comments,
    ]);
    setCommentText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bulletin</Text>
        <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={bookmarked ? colors.gold : colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Author Section */}
        <View style={styles.authorSection}>
          {club ? (
            <Image source={{ uri: club.logo }} style={styles.authorAvatar} />
          ) : (
            <View style={styles.officialAvatar}>
              <Ionicons name="shield-checkmark" size={24} color={colors.white} />
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{bulletin.author}</Text>
            {club && <Text style={styles.clubName}>{club.name}</Text>}
            <Text style={styles.postDate}>
              {new Date(bulletin.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Priority & Category */}
        <View style={styles.metaRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[bulletin.priority] + '18' }]}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColors[bulletin.priority] }]} />
            <Text style={[styles.priorityLabel, { color: priorityColors[bulletin.priority] }]}>
              {priorityLabels[bulletin.priority]}
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {bulletin.category.charAt(0).toUpperCase() + bulletin.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Title & Body */}
        <Text style={styles.title}>{bulletin.title}</Text>
        <Text style={styles.body}>{bulletin.body}</Text>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? '#D32F2F' : colors.textSecondary}
            />
            <Text style={[styles.actionText, liked && { color: '#D32F2F' }]}>
              {likeCount} Like{likeCount !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>
            Comments ({comments.length + bulletin.comments - 2})
          </Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                  {comment.author.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={[styles.commentInputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
          onPress={addComment}
          disabled={!commentText.trim()}
        >
          <Ionicons name="send" size={20} color={commentText.trim() ? colors.white : colors.textMuted} />
        </TouchableOpacity>
      </View>
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
    paddingBottom: spacing.lg,
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
  content: {
    flex: 1,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  officialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.darkGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clubName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGold,
    marginTop: 1,
  },
  postDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 8,
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: colors.lightGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGold,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  commentsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  commentTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  commentText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});
