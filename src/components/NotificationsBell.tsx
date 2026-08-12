import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bell, Award, MessageCircle, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getNotifications, markNotificationsRead, type DbNotification } from "@/lib/db";

const TYPE_CONFIG = {
  achievement: { icon: Award, iconBg: "bg-emerald-100 dark:bg-emerald-950/40", iconColor: "text-emerald-700 dark:text-emerald-400" },
  mention: { icon: MessageCircle, iconBg: "bg-violet-100 dark:bg-violet-950/40", iconColor: "text-violet-600 dark:text-violet-400" },
  system: { icon: Settings, iconBg: "bg-blue-100 dark:bg-blue-950/40", iconColor: "text-blue-600 dark:text-blue-400" },
  reminder: { icon: Bell, iconBg: "bg-amber-100 dark:bg-amber-950/40", iconColor: "text-amber-500 dark:text-amber-400" },
} as const;

function formatTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function NotificationsBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<DbNotification[]>([]);

  const unreadCount = items.filter((i) => i.read_at === null).length;

  useEffect(() => {
    if (!user?.id) return;
    getNotifications(user.id, 5).then(({ data }) => {
      if (data) setItems(data);
    });
  }, [user?.id]);

  const handleMarkAllRead = useCallback(() => {
    if (!user?.id || unreadCount === 0) return;
    markNotificationsRead(user.id).then(() => {
      setItems((prev) => prev.map((i) => ({ ...i, read_at: new Date().toISOString() })));
    });
  }, [user?.id, unreadCount]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative"
          aria-label={`Notificações${unreadCount > 0 ? ` - ${unreadCount} não lida${unreadCount !== 1 ? "s" : ""}` : ""}`}
        >
          <Bell className="h-6 w-6 text-primary-dark" strokeWidth={2} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
              aria-live="polite"
              aria-label={`${unreadCount} notificação${unreadCount !== 1 ? "ões" : ""} não lida${unreadCount !== 1 ? "s" : ""}`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[340px] rounded-2xl border border-stroke-light bg-card p-0 shadow-xl"
        role="dialog"
        aria-label="Painel de notificações"
        aria-describedby="notifications-header"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2" id="notifications-header">
          <h3 className="text-base font-extrabold text-primary-dark">
            Notificações {unreadCount > 0 && <span aria-live="polite">({unreadCount} não lida{unreadCount !== 1 ? "s" : ""})</span>}
          </h3>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-emerald hover:text-emerald-dark"
            aria-label="Marcar todas as notificações como lidas"
            disabled={unreadCount === 0}
          >
            Marcar todas como lidas
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto px-3 pb-2">
          {items.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-stroke-light" />
              <p className="mt-2 text-sm text-foreground-tertiary">Sem notificações.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-1">
              {items.map((n) => {
                const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
                const Icon = config.icon;
                const unread = n.read_at === null;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl p-2.5 transition-colors",
                      unread ? "bg-surface-soft/60" : "bg-card",
                    )}
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.iconBg)}>
                      <Icon className={cn("h-5 w-5", config.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground-dark leading-tight">{n.title}</p>
                      <p className="mt-0.5 text-xs text-foreground-tertiary leading-snug">{n.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 pt-0.5">
                      <span className="text-[10px] text-foreground-placeholder">{formatTime(n.created_at)}</span>
                      {unread && <span className="h-2 w-2 rounded-full bg-emerald" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link
          to="/notifications"
          className="flex items-center justify-center gap-2 border-t border-stroke-muted px-4 py-3 text-sm font-bold text-emerald hover:bg-surface-soft/50 rounded-b-2xl"
        >
          <Settings className="h-4 w-4" />
          Ver todas as notificações
        </Link>
      </PopoverContent>
    </Popover>
  );
}
