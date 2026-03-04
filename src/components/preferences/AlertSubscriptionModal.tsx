import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Check, Volume2, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WARDS } from '@/types/story';
import { toast } from 'sonner';

const ALERT_TOPICS = [
  { code: 'power', label: 'Power Outages', description: 'BESCOM scheduled & unscheduled outages' },
  { code: 'water', label: 'Water Supply', description: 'BWSSB supply disruptions & maintenance' },
  { code: 'garbage', label: 'Garbage Collection', description: 'SWM collection delays & route changes' },
  { code: 'roads', label: 'Roads & Traffic', description: 'Road closures, diversions, repairs' },
  { code: 'flooding', label: 'Flooding & Drains', description: 'Waterlogging alerts & drain blocks' },
  { code: 'health', label: 'Health Advisories', description: 'Public health notices & outbreaks' },
];

export interface AlertPreferences {
  subscribedWards: string[];
  alertTopics: string[];
}

const STORAGE_KEY = 'bengaluru_alert_preferences';

export const loadAlertPreferences = (): AlertPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error('Failed to load alert preferences:', e); }
  return { subscribedWards: [], alertTopics: [] };
};

interface AlertSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlertSubscriptionModal: React.FC<AlertSubscriptionModalProps> = ({ open, onOpenChange }) => {
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const saved = loadAlertPreferences();
      setSelectedWards(saved.subscribedWards);
      setSelectedTopics(saved.alertTopics);
    }
  }, [open]);

  const handleWardToggle = (wardCode: string) => {
    setSelectedWards(prev => prev.includes(wardCode) ? prev.filter(w => w !== wardCode) : [...prev, wardCode]);
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSave = () => {
    const prefs: AlertPreferences = { subscribedWards: selectedWards, alertTopics: selectedTopics };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
    toast.success('Alert preferences saved', {
      description: `Alerts for ${selectedWards.length} ward(s) and ${selectedTopics.length} topic(s)`,
    });
    onOpenChange(false);
  };

  const wardsByZone = WARDS.reduce((acc, ward) => {
    if (!acc[ward.subcounty]) acc[ward.subcounty] = [];
    acc[ward.subcounty].push(ward);
    return acc;
  }, {} as Record<string, typeof WARDS>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 bg-background">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Bell className="w-5 h-5 text-primary" />
            Subscribe to Service Alerts
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified about outages and disruptions in your area
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-8">
            {/* Ward Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Your Ward</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {selectedWards.length} selected
                  </span>
                </div>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setSelectedWards(selectedWards.length === WARDS.length ? [] : WARDS.map(w => w.code))}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {selectedWards.length === WARDS.length ? 'Clear all' : 'Select all'}
                </Button>
              </div>

              {/* Voice help prompt */}
              <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground flex-1">
                  <p className="font-medium text-foreground mb-0.5">Not sure which ward you belong to?</p>
                  <p>
                    Use the{' '}
                    <a href="https://play.google.com/store/apps/details?id=com.dishaank" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Dishaank app</a>
                    {' '}or visit{' '}
                    <a href="https://gba.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">gba.karnataka.gov.in</a>
                    {' '}to find your ward by location.
                  </p>
                </div>
                <Button
                  size="sm" variant="ghost" className="shrink-0 h-7 px-2"
                  aria-label="Read ward help aloud"
                  onClick={() => speakText('Not sure which ward you belong to? Use the Dishaank app or visit gba.karnataka.gov.in to find your ward by location.')}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(wardsByZone).map(([zone, wards]) => (
                  <div key={zone}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{zone}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {wards.map(ward => (
                        <label
                          key={ward.code}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedWards.includes(ward.code)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <Checkbox
                            checked={selectedWards.includes(ward.code)}
                            onCheckedChange={() => handleWardToggle(ward.code)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span className="text-sm font-medium text-foreground">{ward.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">What to Alert Me About</h3>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                    {selectedTopics.length} selected
                  </span>
                </div>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setSelectedTopics(selectedTopics.length === ALERT_TOPICS.length ? [] : ALERT_TOPICS.map(t => t.code))}
                  className="text-xs text-muted-foreground hover:text-secondary"
                >
                  {selectedTopics.length === ALERT_TOPICS.length ? 'Clear all' : 'Select all'}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {ALERT_TOPICS.map(topic => (
                  <label
                    key={topic.code}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTopics.includes(topic.code)
                        ? 'border-secondary bg-secondary/5'
                        : 'border-border hover:border-secondary/50 hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={selectedTopics.includes(topic.code)}
                      onCheckedChange={() => handleTopicToggle(topic.code)}
                      className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{topic.label}</p>
                      <p className="text-xs text-muted-foreground">{topic.description}</p>
                    </div>
                    {selectedTopics.includes(topic.code) && (
                      <Check className="w-5 h-5 text-secondary" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border bg-muted/30">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
              Subscribe to Alerts
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your alert preferences are saved locally on this device
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
