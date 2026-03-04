import React from 'react';
import { Bell, Calendar, FileText, AlertTriangle, Clock, X } from 'lucide-react';
import { loadUserPreferences } from '@/components/preferences/UserPreferencesModal';
import { WARDS } from '@/types/story';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'meeting' | 'proposal' | 'alert' | 'update';
  wardCode: string;
  unread: boolean;
}

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ElementType; bg: string; fg: string }> = {
  meeting: { icon: Calendar, bg: 'bg-blue-100', fg: 'text-blue-600' },
  proposal: { icon: FileText, bg: 'bg-green-100', fg: 'text-green-600' },
  alert: { icon: AlertTriangle, bg: 'bg-amber-100', fg: 'text-amber-600' },
  update: { icon: FileText, bg: 'bg-sky-100', fg: 'text-sky-600' },
};

// Seed notifications tied to wards
const ALL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Townhall Meeting Tomorrow', description: 'Ward Development Discussion at 7:00 PM — Jayanagar Community Hall', time: '2h ago', type: 'meeting', wardCode: 'JAYANAGAR', unread: true },
  { id: '2', title: 'New Proposal in Your Area', description: 'Speed bumps proposed for 30th Cross Road — Your input needed', time: '5h ago', type: 'proposal', wardCode: 'JAYANAGAR', unread: true },
  { id: '3', title: 'Water Supply Maintenance', description: 'Scheduled BWSSB maintenance on Mar 8, 6AM–2PM in Koramangala 4th Block', time: '1d ago', type: 'alert', wardCode: 'KORAMANGALA', unread: false },
  { id: '4', title: 'Budget Proposal Update', description: 'Street lighting improvement proposal for 100ft Road has been approved', time: '2d ago', type: 'update', wardCode: 'INDIRANAGAR', unread: false },
  { id: '5', title: 'BESCOM Power Maintenance', description: 'Planned outage on Mar 10, 10AM–4PM in Whitefield IT Park area', time: '3h ago', type: 'alert', wardCode: 'WHITEFIELD', unread: true },
  { id: '6', title: 'Road Resurfacing Begins', description: 'Outer Ring Road resurfacing near Marathahalli bridge — expect diversions', time: '6h ago', type: 'update', wardCode: 'MARATHAHALLI', unread: true },
  { id: '7', title: 'Community Clean-up Drive', description: 'Join the weekend clean-up drive at HSR Layout Sector 1 lake', time: '1d ago', type: 'meeting', wardCode: 'HSR_LAYOUT', unread: false },
  { id: '8', title: 'New Park Proposal', description: 'Pocket park proposed near Hebbal flyover — public consultation open', time: '2d ago', type: 'proposal', wardCode: 'HEBBAL', unread: false },
  { id: '9', title: 'Drain Cleaning Alert', description: 'Pre-monsoon drain cleaning scheduled in Malleshwaram 8th Cross area', time: '4h ago', type: 'alert', wardCode: 'MALLESHWARAM', unread: true },
  { id: '10', title: 'Traffic Signal Upgrade', description: 'Smart traffic signals being installed at Basavanagudi National College junction', time: '1d ago', type: 'update', wardCode: 'BASAVANAGUDI', unread: false },
];

interface NotificationsPanelProps {
  className?: string;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ className }) => {
  const prefs = loadUserPreferences();
  const subscribedWards = prefs.subscribedWards;

  // Filter by user's ward preferences; if none selected, show all
  const notifications = subscribedWards.length > 0
    ? ALL_NOTIFICATIONS.filter(n => subscribedWards.includes(n.wardCode))
    : ALL_NOTIFICATIONS.slice(0, 4);

  const wardName = (code: string) => WARDS.find(w => w.code === code)?.name ?? code;

  if (notifications.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Notifications</h2>
        {notifications.filter(n => n.unread).length > 0 && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
            {notifications.filter(n => n.unread).length} new
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(n => {
          const cfg = TYPE_CONFIG[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`gov-card p-4 flex items-start gap-4 transition-all ${
                n.unread ? 'border-primary/20 bg-primary/[0.02]' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${cfg.fg}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {n.time}
                  </span>
                  <span className="text-xs text-primary/70 font-medium">{wardName(n.wardCode)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subscribedWards.length === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Set your ward preferences to see personalized notifications
        </p>
      )}
    </div>
  );
};
