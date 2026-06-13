import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bell, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function NotificationPopover() {
  const { notices } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Notices">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          {notices.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-[400px] max-h-[600px] overflow-hidden z-50" sideOffset={8} align="end">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notices</h3>
            <Popover.Close asChild><button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"><X className="w-4 h-4 text-gray-500" /></button></Popover.Close>
          </div>
          <div className="overflow-y-auto max-h-[540px]">
            {notices.map((notice) => (
              <div key={notice.id} className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{notice.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(notice.created_at).toLocaleDateString("en-US")}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{notice.content}</p>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
