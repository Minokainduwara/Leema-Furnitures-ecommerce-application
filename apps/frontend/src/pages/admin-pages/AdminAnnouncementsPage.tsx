import { useState } from "react";
import { authFetch, API_BASE } from "../../utils/api";
import { Megaphone, Send, CheckCircle2 } from "lucide-react";

type Audience = "ALL" | "CUSTOMERS" | "SELLERS";

const AdminAnnouncementsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("ALL");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!title.trim() || !message.trim()) {
      setResult({ ok: false, text: "Please fill in both title and message." });
      return;
    }

    setSending(true);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/announcements`, {
        method: "POST",
        body: JSON.stringify({ title, message, audience }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json().catch(() => ({}));
      setResult({
        ok: true,
        text: data.recipients
          ? `Announcement sent to ${data.recipients} user${data.recipients === 1 ? "" : "s"}.`
          : "Announcement sent.",
      });
      setTitle("");
      setMessage("");
    } catch (err: any) {
      setResult({ ok: false, text: err.message || "Failed to send announcement." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Megaphone size={22} className="text-amber-500" />
          Announcements
        </h1>
        <p className="text-sm text-stone-500">
          Broadcast a notification to your users.
        </p>
      </div>

      <form
        onSubmit={handleSend}
        className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All users</option>
            <option value="CUSTOMERS">Customers only</option>
            <option value="SELLERS">Sellers only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Holiday discount weekend"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            maxLength={140}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write the announcement body…"
            rows={6}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            maxLength={1000}
          />
          <p className="text-xs text-stone-400 mt-1">
            {message.length}/1000 characters
          </p>
        </div>

        {result && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border
              ${result.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"}`}
          >
            {result.ok && <CheckCircle2 size={16} />}
            {result.text}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-amber-500/30 disabled:opacity-60 flex items-center gap-2"
        >
          <Send size={16} />
          {sending ? "Sending…" : "Send Announcement"}
        </button>
      </form>
    </div>
  );
};

export default AdminAnnouncementsPage;