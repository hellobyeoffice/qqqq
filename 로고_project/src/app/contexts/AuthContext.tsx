import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type OAuthProvider = "google" | "kakao";
export type UserRole = "USER" | "ADMIN";
export type ShareType = "instagram_reels" | "kakao" | "sms" | "copy_link";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar: string;
  provider: OAuthProvider;
  providers: OAuthProvider[];
  role: UserRole;
  created_at: string;
}

export interface UploadedPhoto {
  id: number;
  user_id: number;
  image_url: string;
  url: string;
  title: string;
  name: string;
  created_at: string;
  uploadedAt: string;
  authorName: string;
  authorAvatar: string;
  likesCount: number;
  sharesCount: number;
}

export interface LikeRecord {
  id: number;
  user_id: number;
  photo_id: number;
}

export interface ShareRecord {
  id: number;
  user_id: number;
  photo_id: number;
  share_type: ShareType;
  created_at: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface RealtimeActivity {
  id: number;
  type: "like" | "share" | "upload";
  user: string;
  avatar: string;
  image: string;
  content: string;
  time: string;
  created_at: string;
}

interface AddPhotoInput {
  url: string;
  name: string;
  title?: string;
  uploadedAt?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  users: AuthUser[];
  uploadedPhotos: UploadedPhoto[];
  photos: UploadedPhoto[];
  realtimeActivities: RealtimeActivity[];
  likes: LikeRecord[];
  shares: ShareRecord[];
  notices: Notice[];
  login: (provider: OAuthProvider, userData: Omit<AuthUser, "id" | "providers" | "role" | "created_at"> & Partial<AuthUser>) => void;
  logout: () => void;
  addUploadedPhoto: (photo: AddPhotoInput) => UploadedPhoto;
  addUploadedPhotos: (photos: AddPhotoInput[]) => UploadedPhoto[];
  toggleLike: (photoId: number) => boolean;
  recordShare: (photoId: number, shareType: ShareType) => void;
  getPhotoScore: (photoId: number) => number;
  hasLiked: (photoId: number) => boolean;
}

const nowIso = () => new Date().toISOString();
const formatDate = (date = new Date()) => date.toLocaleString("en-US");

const seedUsers: AuthUser[] = [
  {
    id: 1,
    email: "admin@logo.app",
    name: "Admin",
    avatar: "https://i.pravatar.cc/150?img=8",
    provider: "google",
    providers: ["google"],
    role: "ADMIN",
    created_at: nowIso(),
  },
  {
    id: 2,
    email: "user@logo.app",
    name: "Member",
    avatar: "https://i.pravatar.cc/150?img=11",
    provider: "kakao",
    providers: ["kakao"],
    role: "USER",
    created_at: nowIso(),
  },
];

const seedPhotos: UploadedPhoto[] = Array.from({ length: 36 }, (_, index) => {
  const id = index + 1;
  const owner = seedUsers[index % seedUsers.length];
  const createdAt = new Date(Date.now() - index * 3600 * 1000);

  return {
    id,
    user_id: owner.id,
    image_url: `https://picsum.photos/seed/logo-photo-${id}/700/700`,
    url: `https://picsum.photos/seed/logo-photo-${id}/700/700`,
    title: `Featured photo ${id}`,
    name: `photo-${id}.jpg`,
    created_at: createdAt.toISOString(),
    uploadedAt: formatDate(createdAt),
    authorName: owner.name,
    authorAvatar: owner.avatar,
    likesCount: 18 + ((index * 11) % 90),
    sharesCount: 3 + ((index * 7) % 35),
  };
});

const seedNotices: Notice[] = [
  {
    id: 1,
    title: "Team notice",
    content: "Uploaded photos appear in Realtime and on the randomized home feed.",
    created_at: nowIso(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>(seedUsers);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>(seedPhotos);
  const [realtimeActivities, setRealtimeActivities] = useState<RealtimeActivity[]>([]);
  const [likes, setLikes] = useState<LikeRecord[]>([]);
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [notices] = useState<Notice[]>(seedNotices);

  const addRealtimeActivity = (activity: Omit<RealtimeActivity, "id" | "time" | "created_at">) => {
    setRealtimeActivities((prev) => [
      {
        ...activity,
        id: Date.now() + Math.floor(Math.random() * 1000),
        time: "Just now",
        created_at: nowIso(),
      },
      ...prev,
    ]);
  };

  const login: AuthContextType["login"] = (provider, userData) => {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const existing = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (existing) {
      const mergedUser: AuthUser = {
        ...existing,
        name: userData.name || existing.name,
        avatar: userData.avatar || existing.avatar,
        provider,
        providers: Array.from(new Set([...existing.providers, provider])),
      };
      setUsers((prev) => prev.map((item) => (item.id === existing.id ? mergedUser : item)));
      setUser(mergedUser);
      setIsLoggedIn(true);
      return;
    }

    const nextUser: AuthUser = {
      id: Date.now(),
      email: normalizedEmail,
      name: userData.name,
      avatar: userData.avatar,
      provider,
      providers: [provider],
      role: userData.role ?? "USER",
      created_at: nowIso(),
    };
    setUsers((prev) => [nextUser, ...prev]);
    setUser(nextUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addUploadedPhoto = (photo: AddPhotoInput) => {
    const owner = user ?? seedUsers[1];
    const nextPhoto: UploadedPhoto = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      user_id: owner.id,
      image_url: photo.url,
      url: photo.url,
      title: photo.title || photo.name,
      name: photo.name,
      created_at: nowIso(),
      uploadedAt: photo.uploadedAt ?? formatDate(),
      authorName: owner.name,
      authorAvatar: owner.avatar,
      likesCount: 0,
      sharesCount: 0,
    };
    setUploadedPhotos((prev) => [nextPhoto, ...prev]);
    addRealtimeActivity({
      type: "upload",
      user: owner.name,
      avatar: owner.avatar,
      image: nextPhoto.image_url,
      content: `${nextPhoto.title} uploaded`,
    });
    return nextPhoto;
  };

  const addUploadedPhotos = (photos: AddPhotoInput[]) => photos.map(addUploadedPhoto);

  const hasLiked = (photoId: number) => {
    if (!user) return false;
    return likes.some((like) => like.user_id === user.id && like.photo_id === photoId);
  };

  const toggleLike = (photoId: number) => {
    if (!user) return false;
    const alreadyLiked = hasLiked(photoId);

    setLikes((prev) =>
      alreadyLiked
        ? prev.filter((like) => !(like.user_id === user.id && like.photo_id === photoId))
        : [{ id: Date.now(), user_id: user.id, photo_id: photoId }, ...prev]
    );
    setUploadedPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, likesCount: Math.max(0, photo.likesCount + (alreadyLiked ? -1 : 1)) } : photo
      )
    );

    if (!alreadyLiked) {
      const photo = uploadedPhotos.find((item) => item.id === photoId);
      if (photo) {
        addRealtimeActivity({
          type: "like",
          user: user.name,
          avatar: user.avatar,
          image: photo.image_url,
          content: "liked a photo",
        });
      }
    }

    return !alreadyLiked;
  };

  const recordShare = (photoId: number, shareType: ShareType) => {
    if (!user) return;
    const photo = uploadedPhotos.find((item) => item.id === photoId);
    if (!photo) return;

    setShares((prev) => [
      { id: Date.now(), user_id: user.id, photo_id: photoId, share_type: shareType, created_at: nowIso() },
      ...prev,
    ]);
    setUploadedPhotos((prev) => prev.map((item) => (item.id === photoId ? { ...item, sharesCount: item.sharesCount + 1 } : item)));
    addRealtimeActivity({
      type: "share",
      user: user.name,
      avatar: user.avatar,
      image: photo.image_url,
      content: "shared a photo",
    });
  };

  const getPhotoScore = (photoId: number) => {
    const photo = uploadedPhotos.find((item) => item.id === photoId);
    return photo ? photo.likesCount + photo.sharesCount * 3 : 0;
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      users,
      uploadedPhotos,
      photos: uploadedPhotos,
      realtimeActivities,
      likes,
      shares,
      notices,
      login,
      logout,
      addUploadedPhoto,
      addUploadedPhotos,
      toggleLike,
      recordShare,
      getPhotoScore,
      hasLiked,
    }),
    [isLoggedIn, user, users, uploadedPhotos, realtimeActivities, likes, shares, notices]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
