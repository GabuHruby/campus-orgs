import type { Announcement, Club, ClubMember, ClubRole, Message } from '@/types/domain';

/** One entry in a club channel: a regular message or an announcement. */
export type ChannelItem =
  | { kind: 'message'; id: string; authorId: string; sentAt: string; message: Message }
  | { kind: 'announcement'; id: string; authorId: string; sentAt: string; announcement: Announcement };

/** A club's messages and announcements merged into one stream, oldest first (chat order). */
export function buildChannel(
  clubId: string,
  messages: Message[],
  announcements: Announcement[],
): ChannelItem[] {
  const items: ChannelItem[] = [
    ...messages
      .filter((m) => m.clubId === clubId)
      .map((m) => ({ kind: 'message' as const, id: m.id, authorId: m.authorId, sentAt: m.sentAt, message: m })),
    ...announcements
      .filter((a) => a.clubId === clubId)
      .map((a) => ({
        kind: 'announcement' as const,
        id: a.id,
        authorId: a.authorId,
        sentAt: a.postedAt,
        announcement: a,
      })),
  ];
  return items.sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

/** Text for the chat list preview, e.g. "📣 Project applications are open". */
export function previewText(item: ChannelItem): string {
  return item.kind === 'announcement' ? `📣 ${item.announcement.title}` : item.message.body;
}

/**
 * Whether someone with `role` may send messages in `club`. Leaders and posters always can;
 * plain members only when the leader has opened the chat to everyone.
 */
export function canPost(club: Club, role: ClubRole): boolean {
  return role !== 'member' || club.chatPermission === 'everyone';
}

export function roleOf(member: ClubMember | undefined): ClubRole {
  return member?.role ?? 'member';
}

/** Badge text: the custom title if set, otherwise the role name. */
export function roleLabel(member: ClubMember): string {
  return member.title ?? (member.role === 'leader' ? 'Leader' : 'Poster');
}
