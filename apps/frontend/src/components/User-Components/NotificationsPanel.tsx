import React, { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { userApi, type UserNotification } from "../../utils/userApi";

const formatDate = (d?: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString("en-LK", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UserNotification | null>(null);

  const load = async () => {
    setLoading(true);
    setNotifications(await userApi.getNotifications());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNotification = async (n: UserNotification) => {
    setSelected(n);
    if (!n.read) {
      await userApi.markNotificationRead(n.id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => userApi.markNotificationRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-amber-600" />
            <h3 className="font-semibold text-stone-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-amber-600 font-semibold hover:underline"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-12">No notifications yet</p>
        ) : (
          <div className="divide-y divide-stone-100 max-h-[480px] overflow-y-auto">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className={`w-full text-left px-5 py-4 hover:bg-stone-50 transition ${
                  !n.read ? "bg-amber-50/50" : ""
                } ${selected?.id === n.id ? "border-l-4 border-amber-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${!n.read ? "text-stone-900" : "text-stone-600"}`}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">{n.message}</p>
                <p className="text-xs text-stone-300 mt-1">{formatDate(n.createdAt)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
        {selected ? (
          <>
            <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
              {selected.type ?? "Notification"}
            </p>
            <h3 className="text-lg font-bold text-stone-800 mb-2">{selected.title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </p>
            <p className="text-xs text-stone-400 mt-4">{formatDate(selected.createdAt)}</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-stone-400">
            <Bell size={32} className="mb-3 opacity-30" />
            <p className="text-sm">Select a notification to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
