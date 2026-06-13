import { useState } from "react";
import { Clock, Heart, Share2, Upload } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

export function History() {
  const { realtimeActivities } = useAuth();
  const [filter, setFilter] = useState<"all" | "upload" | "like" | "share">("all");
  const filteredItems = filter === "all" ? realtimeActivities : realtimeActivities.filter((item) => item.type === filter);
  const getIcon = (type: "upload" | "like" | "share") => type === "like" ? <Heart className="w-4 h-4" /> : type === "share" ? <Share2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Activity history</h1>
          <div className="flex gap-2">
            {([["all", "All"], ["upload", "Uploads"], ["like", "Likes"], ["share", "Shares"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-lg transition-colors ${filter === id ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {filteredItems.length === 0 ? <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500">No activity yet.</div> : filteredItems.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex gap-4">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden"><ImageWithFallback src={item.image} alt={item.content} className="w-full h-full object-cover" /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.content}</h3><div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4" /><span>{item.time}</span></div></div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">{getIcon(item.type)}{item.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.user}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
