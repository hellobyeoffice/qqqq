import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { Award, ChevronLeft, ChevronRight, Grid3x3, Heart, List, Share2, TrendingUp, Trophy } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

const ITEMS_PER_PAGE = 30;
const categoryNames: Record<string, string> = { popular: "Popular", best: "Best", landscape: "Landscape", portrait: "Portrait", sports: "Sports" };

export function Ranking() {
  const { category = "popular" } = useParams();
  const { photos, getPhotoScore } = useAuth();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const rankingData = useMemo(() => photos.map((photo) => ({ ...photo, score: getPhotoScore(photo.id) })).sort((a, b) => b.score - a.score).map((photo, index) => ({ ...photo, rank: index + 1 })), [photos, getPhotoScore]);
  const totalPages = Math.max(1, Math.ceil(rankingData.length / ITEMS_PER_PAGE));
  const currentItems = rankingData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const Icon = category === "best" ? Award : category === "sports" ? Trophy : TrendingUp;
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div><div className="flex items-center gap-3"><Icon className="w-8 h-8 text-blue-600" /><h1 className="text-3xl font-bold text-gray-900 dark:text-white">{categoryNames[category] ?? "Popular"} Ranking</h1></div><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Score = likes x 1 + shares x 3</p></div>
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="Grid view"><Grid3x3 className="w-5 h-5" /></button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded transition-colors ${viewMode === "table" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="List view"><List className="w-5 h-5" /></button>
          </div>
        </div>
        {viewMode === "table" ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-100 dark:divide-gray-700">
            {currentItems.map((item) => <div key={item.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><span className={`w-12 text-center font-bold text-base ${item.rank <= 3 ? "text-blue-600" : "text-gray-500 dark:text-gray-400"}`}>#{item.rank}</span><img src={item.image_url} alt={item.title} className="w-10 h-10 rounded object-cover" /><span className="flex-1 font-medium text-gray-900 dark:text-white text-sm truncate">{item.title}</span><div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" />{item.likesCount}</span><span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-blue-400" />{item.sharesCount}</span><span className="font-semibold text-gray-900 dark:text-white">{item.score} pts</span></div></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((item) => <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all group"><div className="aspect-square overflow-hidden relative"><ImageWithFallback src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute top-2 left-2 bg-white dark:bg-gray-900 rounded-full min-w-10 h-10 px-2 flex items-center justify-center shadow-lg"><span className="text-sm font-bold text-gray-900 dark:text-white">#{item.rank}</span></div></div><div className="p-4"><h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{item.title}</h3><p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.authorName}</p><div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"><span>{item.score} pts</span><span>{item.likesCount} + {item.sharesCount}x3</span></div></div></div>)}
          </div>
        )}
        <div className="flex items-center justify-center gap-2 mt-8"><button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-gray-900 dark:text-white"><ChevronLeft className="w-5 h-5" /></button><span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{currentPage} / {totalPages}</span><button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-gray-900 dark:text-white"><ChevronRight className="w-5 h-5" /></button></div>
      </div>
    </div>
  );
}
