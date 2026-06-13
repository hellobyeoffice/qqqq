import { useCallback, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Check, Copy, Heart, MessageCircle, Send, Share2, Video, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import type { ShareType } from "../contexts/AuthContext";

interface PhotoDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo: { id: number; url: string; alt: string };
}

interface FloatingHeart {
  id: number;
  x: number;
}

const sampleComments = [
  { id: 1, user: "Alex", avatar: "https://i.pravatar.cc/150?img=1", content: "Great shot.", time: "2 hours ago" },
  { id: 2, user: "Mina", avatar: "https://i.pravatar.cc/150?img=2", content: "Love the color.", time: "5 hours ago" },
];

export function PhotoDetailModal({ open, onOpenChange, photo }: PhotoDetailModalProps) {
  const { photos, user, isLoggedIn, hasLiked, toggleLike, recordShare, getPhotoScore } = useAuth();
  const photoData = photos.find((item) => item.id === photo.id);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(sampleComments);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const liked = hasLiked(photo.id);

  const photoUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("photo", String(photo.id));
    return url.toString();
  }, [photo.id]);

  const requireLogin = () => {
    if (isLoggedIn) return true;
    alert("Please log in first.");
    return false;
  };

  const handleLike = useCallback(() => {
    if (!requireLogin()) return;
    const nextLiked = toggleLike(photo.id);
    if (!nextLiked) return;
    const newHeart = { id: Date.now(), x: Math.random() * 40 - 20 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    window.setTimeout(() => setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id)), 1000);
  }, [photo.id, toggleLike, isLoggedIn]);

  const handleShare = async (shareType: ShareType) => {
    if (!requireLogin()) return;
    recordShare(photo.id, shareType);
    if (shareType === "kakao") window.open(`https://story.kakao.com/share?url=${encodeURIComponent(photoUrl)}`, "_blank");
    if (shareType === "sms") window.open(`sms:?body=${encodeURIComponent(photoUrl)}`, "_self");
    if (shareType === "instagram_reels") alert("Open Instagram Reels and paste this link.");
    if (shareType === "copy_link") {
      await navigator.clipboard?.writeText(photoUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
    setShareOpen(false);
  };

  const handleCommentSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim() || !requireLogin()) return;
    setComments([
      { id: Date.now(), user: user?.name ?? "User", avatar: user?.avatar ?? "https://i.pravatar.cc/150?img=10", content: comment, time: "Just now" },
      ...comments,
    ]);
    setComment("");
  };

  const shareOptions: Array<{ id: ShareType; label: string; icon: ReactNode; className: string }> = [
    { id: "instagram_reels", label: "Instagram Reels", icon: <Video className="w-5 h-5 text-white" />, className: "bg-pink-500" },
    { id: "kakao", label: "KakaoTalk", icon: <MessageCircle className="w-5 h-5 text-black" />, className: "bg-[#FEE500]" },
    { id: "sms", label: "Text message", icon: <MessageCircle className="w-5 h-5 text-white" />, className: "bg-green-500" },
    { id: "copy_link", label: copied ? "Copied" : "Copy link", icon: copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />, className: "bg-gray-800" },
  ];

  return (
    <>
      <style>{`@keyframes floatHeart{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(.8)}}.float-heart{animation:floatHeart .9s ease-out forwards;pointer-events:none;position:absolute;bottom:8px}`}</style>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl z-50 w-[90vw] max-w-6xl h-[90vh] flex">
            <Dialog.Title className="sr-only">Photo detail</Dialog.Title>
            <Dialog.Description className="sr-only">View photo, comments, likes, and shares.</Dialog.Description>
            <div className="flex-1 bg-black flex items-center justify-center">
              <ImageWithFallback src={photo.url} alt={photo.alt} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="w-[400px] flex flex-col bg-white dark:bg-gray-900">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={photoData?.authorAvatar ?? "https://i.pravatar.cc/150?img=5"} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{photoData?.authorName ?? "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{photoData?.uploadedAt ?? "Just now"}</p>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
                </Dialog.Close>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.avatar} alt={item.user} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm text-gray-900 dark:text-white">{item.user}</span><span className="text-xs text-gray-500">{item.time}</span></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    {floatingHearts.map((heart) => <span key={heart.id} className="float-heart text-red-500" style={{ left: `calc(50% + ${heart.x}px)` }}>{"\u2665"}</span>)}
                    <button onClick={handleLike} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                      <Heart className={`w-6 h-6 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-300"}`} />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{photoData?.likesCount ?? 0}</span>
                    </button>
                  </div>
                  <Popover.Root open={shareOpen} onOpenChange={setShareOpen}>
                    <Popover.Trigger asChild><button className="flex items-center gap-2 hover:opacity-70 transition-opacity"><Share2 className="w-6 h-6 text-gray-700 dark:text-gray-300" /><span className="text-sm font-semibold text-gray-900 dark:text-white">{photoData?.sharesCount ?? 0}</span></button></Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content side="top" align="start" sideOffset={8} className="bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[100] w-60">
                        <p className="text-xs text-gray-400 px-2 py-1 mb-1">Share</p>
                        {shareOptions.map((option) => (
                          <button key={option.id} onClick={() => void handleShare(option.id)} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${option.className}`}>{option.icon}</span>
                            <span className="text-sm text-gray-800">{option.label}</span>
                          </button>
                        ))}
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <span className="ml-auto text-sm font-semibold text-gray-600 dark:text-gray-300">Score {getPhotoScore(photo.id).toLocaleString()}</span>
                </div>
                <form onSubmit={handleCommentSubmit} className="p-4 flex gap-2 items-center">
                  <input type="text" placeholder="Add a comment..." value={comment} onChange={(event) => setComment(event.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="submit" disabled={!comment.trim()} className="p-2 hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"><Send className="w-5 h-5 text-blue-500" /></button>
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
