import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, Image as ImageIcon, Upload, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const navigate = useNavigate();
  const { addUploadedPhotos, isLoggedIn, user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user?.role === "ADMIN";

  const reset = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 15 * 1024 * 1024;
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is larger than 15MB.`);
        return false;
      }
      return true;
    });

    const nextFiles = isAdmin ? validFiles : validFiles.slice(0, 1);
    if (!isAdmin && validFiles.length > 1) {
      alert("Regular users can upload one photo at a time.");
    }
    if (nextFiles.length === 0) return;

    setSelectedFiles((prev) => (isAdmin ? [...prev, ...nextFiles] : nextFiles));
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => (isAdmin ? [...prev, ...nextPreviews] : nextPreviews));
  };

  const handleUpload = () => {
    if (!isLoggedIn) {
      onOpenChange(false);
      navigate("/login");
      return;
    }
    if (selectedFiles.length === 0) return;

    addUploadedPhotos(
      previews.map((url, index) => ({
        url,
        name: selectedFiles[index]?.name ?? `photo-${index + 1}.jpg`,
        title: selectedFiles[index]?.name?.replace(/\.[^.]+$/, "") ?? `Uploaded photo ${index + 1}`,
      }))
    );

    alert(`${selectedFiles.length} photo(s) uploaded.`);
    reset();
    onOpenChange(false);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setPreviews((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl z-50 w-[90vw] max-w-2xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">Photo upload</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Upload image files.</Dialog.Description>

          <div className="p-6">
            <input ref={fileInputRef} type="file" accept="image/*" multiple={isAdmin} onChange={handleFileSelect} className="hidden" />
            <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">{isAdmin ? "Admin bulk upload" : "User upload"}</p>
                <p>Images up to 15MB appear immediately in Realtime and on the home feed.</p>
              </div>
            </div>

            {previews.length === 0 ? (
              <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{isAdmin ? "Select photos" : "Select a photo"}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Click to choose files.</span>
              </button>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {previews.map((preview, index) => (
                    <div key={preview} className="relative group">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button onClick={() => handleRemoveFile(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4">
                  {isAdmin ? "Add more" : "Choose another"}
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            </Dialog.Close>
            <button onClick={handleUpload} disabled={selectedFiles.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
