import { useMemo, useState } from "react";
import { Activity, Grid3x3, Heart, List, Share2, Upload } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import type { RealtimeActivity } from "../contexts/AuthContext";

export function Realtime() {
  const { realtimeActivities, photos } = useAuth();
  const [viewMode, setViewMode] = useState<"photo" | "list">("list");
  const activities = useMemo<RealtimeActivity[]>(() => {
    const uploads = photos.slice().sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 30).map((photo) => ({
      id: photo.id,
      type: "upload" as const,
      user: photo.authorName,
      avatar: photo.authorAvatar,
      image: photo.image_url,
      content: `${photo.title} uploaded`,
      time: photo.uploadedAt,
      created_at: photo.created_at,
    }));
    return [...realtimeActivities, ...uploads].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 50);
  }, [photos, realtimeActivities]);
  const getActivityText = (activity: RealtimeActivity) => activity.type === "like" ? "liked a photo" : activity.type === "share" ? "shared a photo" : activity.content;
  const getActivityIcon = (type: RealtimeActivity["type"]) => type === "like" ? <Heart className="w-4 h-4 text-red-500" /> : type === "share" ? <Share2 className="w-4 h-4 text-blue-500" /> : <Upload className="w-4 h-4 text-green-500" />;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3"><Activity className="w-8 h-8 text-blue-600 animate-pulse" /><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Realtime</h1><span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span></div>
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button onClick={() => setViewMode("photo")} className={`p-2 rounded transition-colors ${viewMode === "photo" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="Grid view"><Grid3x3 className="w-5 h-5" /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="List view"><List className="w-5 h-5" /></button>
          </div>
        </div>
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-100 dark:divide-gray-700">
            {activities.map((activity) => <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><span>{getActivityIcon(activity.type)}</span><span className="font-semibold text-gray-900 dark:text-white text-sm w-28 truncate">{activity.user}</span><span className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">{getActivityText(activity)}</span><span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activities.map((activity) => <div key={`${activity.type}-${activity.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all group"><div className="aspect-square overflow-hidden relative"><ImageWithFallback src={activity.image} alt={activity.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full p-2 shadow">{getActivityIcon(activity.type)}</div></div><div className="p-3"><div className="flex items-center gap-2 mb-1"><img src={activity.avatar} alt={activity.user} className="w-6 h-6 rounded-full" /><span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activity.user}</span></div><p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p></div></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
