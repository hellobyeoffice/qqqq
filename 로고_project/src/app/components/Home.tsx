import { useEffect, useMemo, useState } from "react";
import { Search, Shuffle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PhotoDetailModal } from "./PhotoDetailModal";
import { useAuth } from "../contexts/AuthContext";
import type { UploadedPhoto } from "../contexts/AuthContext";

const shufflePhotos = (photos: UploadedPhoto[]) => [...photos].sort(() => Math.random() - 0.5);

export function Home() {
  const { photos } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [randomPhotos, setRandomPhotos] = useState<UploadedPhoto[]>(() => shufflePhotos(photos));
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);

  useEffect(() => {
    setRandomPhotos(shufflePhotos(photos));
    const interval = window.setInterval(() => setRandomPhotos(shufflePhotos(photos)), 30000);
    return () => window.clearInterval(interval);
  }, [photos]);

  const visiblePhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return randomPhotos;
    return randomPhotos.filter((photo) => photo.title.toLowerCase().includes(query) || photo.authorName.toLowerCase().includes(query) || photo.name.toLowerCase().includes(query));
  }, [randomPhotos, searchQuery]);

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <button className="text-6xl font-bold text-black dark:text-white mb-8" onClick={() => window.location.assign("/")}>LOGO</button>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search photos or authors" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Shuffle className="w-4 h-4" />
            <span>Random on refresh and every 30 seconds</span>
          </div>
          <button onClick={() => setRandomPhotos(shufflePhotos(photos))} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Shuffle</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visiblePhotos.map((photo) => (
            <button key={photo.id} onClick={() => setSelectedPhoto(photo)} className="aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-100 dark:bg-gray-800">
              <ImageWithFallback src={photo.image_url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </button>
          ))}
        </div>
        {selectedPhoto && <PhotoDetailModal open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)} photo={{ id: selectedPhoto.id, url: selectedPhoto.image_url, alt: selectedPhoto.title }} />}
      </div>
    </div>
  );
}
