import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Archive, Star, Trash2, X } from "lucide-react";

interface MailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleMails = [
  { id: 1, from: "admin@logo.app", subject: "Welcome", preview: "Thanks for joining LOGO. Upload photos and try the ranking system.", time: "10:30 AM", isRead: false, isStarred: false },
  { id: 2, from: "notifications@logo.app", subject: "Team notice", preview: "Ranking now gives share activity a higher weight.", time: "Yesterday", isRead: true, isStarred: true },
];

export function MailModal({ open, onOpenChange }: MailModalProps) {
  const [mails, setMails] = useState(sampleMails);
  const [selectedMail, setSelectedMail] = useState<number | null>(null);
  const selectedMailData = mails.find((mail) => mail.id === selectedMail);
  const handleStarToggle = (id: number) => setMails((prev) => prev.map((mail) => (mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail)));
  const handleDelete = (id: number) => {
    setMails((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail === id) setSelectedMail(null);
  };
  const handleMailClick = (id: number) => {
    setSelectedMail(id);
    setMails((prev) => prev.map((mail) => (mail.id === id ? { ...mail, isRead: true } : mail)));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden shadow-xl z-50 w-[90vw] max-w-4xl h-[80vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-gray-900">Mail</Dialog.Title>
            <Dialog.Close asChild><button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-700" /></button></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Read mail and team notices.</Dialog.Description>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {mails.map((mail) => (
                <div key={mail.id} onClick={() => handleMailClick(mail.id)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!mail.isRead ? "bg-blue-50" : ""} ${selectedMail === mail.id ? "bg-gray-100" : ""}`}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1">
                      <button onClick={(event) => { event.stopPropagation(); handleStarToggle(mail.id); }} className="hover:scale-110 transition-transform">
                        <Star className={`w-4 h-4 ${mail.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                      </button>
                      <span className={`text-sm truncate ${!mail.isRead ? "font-semibold" : ""}`}>{mail.from}</span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{mail.time}</span>
                  </div>
                  <p className={`text-sm mb-1 ${!mail.isRead ? "font-semibold" : ""}`}>{mail.subject}</p>
                  <p className="text-xs text-gray-600 truncate">{mail.preview}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col">
              {selectedMailData ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div><h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedMailData.subject}</h3><p className="text-sm text-gray-600">From: {selectedMailData.from}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(selectedMailData.id)} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-gray-600" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Archive"><Archive className="w-4 h-4 text-gray-600" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{selectedMailData.time}</p>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto"><p className="text-gray-700">{selectedMailData.preview}</p></div>
                </>
              ) : <div className="flex-1 flex items-center justify-center text-gray-400">Select a mail.</div>}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
