"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Music, Terminal, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HoverFx } from "@/components/ui/hover-fx";

interface ActivityAssets {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

interface SpotifyData {
  timestamps?: {
    start?: number;
    end?: number;
  };
  album?: string;
  album_art_url?: string;
  artist?: string;
  song?: string;
  track_id?: string;
}

interface DiscordActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  assets?: ActivityAssets;
  timestamps?: {
    start?: number;
    end?: number;
  };
  buttons?: string[];
  created_at?: number;
}

interface LanyardData {
  discord_user: {
    username: string;
    global_name: string;
    avatar: string;
  };
  discord_status: string;
  activities: DiscordActivity[];
  listening_to_spotify: boolean;
  spotify?: SpotifyData;
}

export default function DiscordRPC() {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [elapsed, setElapsed] = useState<string>("about 1 hour");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverButton, setHoverButton] = useState(false);

  const userId = "1003289653014691911";

  const fetchLanyardData = async () => {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Discord status");
      }
      const data = await response.json();
      if (data.success) {
        setLanyardData(data.data);

        // Update elapsed time based on fetched data
        updateElapsedTime(data.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Error fetching Lanyard data:", err);
      // Don't set error state to avoid showing error UI
    }
  };

  const updateElapsedTime = (data: LanyardData) => {
    // Find any activity with timestamps
    const activityWithTime = data.activities.find(act => act.timestamps?.start);

    if (activityWithTime?.timestamps?.start) {
      const startTime = activityWithTime.timestamps.start;
      const elapsedTime = formatDistanceToNow(startTime, { addSuffix: false });
      setElapsed(elapsedTime);
    } else if (data.listening_to_spotify && data.spotify?.timestamps?.start) {
      const startTime = data.spotify.timestamps.start;
      const elapsedTime = formatDistanceToNow(startTime, { addSuffix: false });
      setElapsed(elapsedTime);
    }
  };

  // Format URLs for Discord images
  const formatImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";

    // If it's already a proper URL, return it
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Handle external images that come with mp: prefix
    if (imageUrl.startsWith("mp:external")) {
      // Extract the actual URL part - use a proper regex to extract the github URL
      const matches = imageUrl.match(/https?:\/\/[^/]+(\/.*)/);
      if (matches && matches[0]) {
        return matches[0];
      }
      return "";
    }

    // Handle Spotify images
    if (imageUrl.startsWith("spotify:")) {
      return `https://i.scdn.co/image/${imageUrl.substring(8)}`;
    }

    // Handle Discord CDN images
    return `https://cdn.discordapp.com/app-assets/${imageUrl}`;
  };

  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      // Initial fetch
      fetchLanyardData();

      // Fetch data every 15 seconds
      const fetchInterval = setInterval(fetchLanyardData, 15000);

      // Update elapsed time every second
      const updateElapsedInterval = setInterval(() => {
        if (lanyardData) {
          updateElapsedTime(lanyardData);
        }
      }, 1000);

      return () => {
        clearInterval(fetchInterval);
        clearInterval(updateElapsedInterval);
      };
    }
  }, [lanyardData]);

  // Find the main activity to display
  const getMainActivity = (): { activity: DiscordActivity | null, isSpotify: boolean } => {
    if (!lanyardData) {
      return { activity: { id: "placeholder", name: "Code", type: 0, details: "Idling" }, isSpotify: false };
    }

    // If listening to Spotify, prioritize that
    if (lanyardData.listening_to_spotify && lanyardData.spotify) {
      return {
        activity: {
          id: "spotify",
          name: "Spotify",
          type: 2, // Listening
          state: lanyardData.spotify.artist,
          details: lanyardData.spotify.song,
          assets: {
            large_image: lanyardData.spotify.album_art_url
          },
          timestamps: lanyardData.spotify.timestamps
        },
        isSpotify: true
      };
    }

    // Find any non-custom activity
    const nonCustomActivity = lanyardData.activities.find(act => act.type !== 4);
    if (nonCustomActivity) {
      return { activity: nonCustomActivity, isSpotify: false };
    }

    // If no other activity, use the first one (usually Custom Status)
    if (lanyardData.activities.length > 0) {
      return { activity: lanyardData.activities[0], isSpotify: false };
    }

    return { activity: null, isSpotify: false };
  };

  // Get activity icon
  const getActivityIcon = (activity: DiscordActivity | null, isSpotify: boolean) => {
    if (!activity) return <Activity size={24} className="text-primary" />;

    if (isSpotify) {
      return <Music size={24} className="text-primary" />;
    }

    switch(activity.name) {
      case "Code":
        return <Code size={24} className="text-primary" />;
      case "Spotify":
        return <Music size={24} className="text-primary" />;
      case "Terminal":
        return <Terminal size={24} className="text-primary" />;
      default:
        return <Activity size={24} className="text-primary" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "dnd": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const { activity, isSpotify } = getMainActivity();

  return (
    <motion.div
      className="w-full mt-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <HoverFx glowSize={80} glowOpacity={0.1} glowColor="var(--primary)">
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden w-full">
          <div className="flex items-center p-2 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2 max-w-[75%]">
              <div className="w-8 h-8 min-w-8 rounded-full overflow-hidden bg-primary/10">
                {lanyardData?.discord_user?.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${userId}/${lanyardData.discord_user.avatar}.webp?size=80`}
                    alt={lanyardData?.discord_user?.global_name || lanyardData?.discord_user?.username || "longathelstan"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-lg font-bold">
                    L
                  </div>
                )}
              </div>
              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm truncate">@{lanyardData?.discord_user?.username || "longathelstan"}</span>
                  <span className="text-primary shrink-0">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 -mt-0.5">
                  <span className={`w-2 h-2 shrink-0 rounded-full ${lanyardData ? getStatusColor(lanyardData.discord_status) : "bg-red-500"}`}></span>
                  <span className="truncate">{activity?.state || "2025 target: pass CHT"}</span>
                </div>
              </div>
            </div>
            <div className="ml-auto shrink-0 relative">
              <motion.button
                className="text-primary text-xs flex items-center justify-center bg-primary/10 px-1.5 py-1 rounded-full w-6 h-6 relative"
                onHoverStart={() => setHoverButton(true)}
                onHoverEnd={() => setHoverButton(false)}
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
                <AnimatePresence>
                  {hoverButton && (
                    <motion.span
                      className="absolute whitespace-nowrap left-0 -translate-x-full px-2 py-1 bg-card border border-border rounded-md text-xs mr-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: -8 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                    >
                      Add on Discord
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <div className="p-2.5">
            <div className="flex items-start">
              <div className="mr-2.5 w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {activity?.assets?.large_image ? (
                  <img
                    src={formatImageUrl(activity.assets.large_image)}
                    alt={activity.assets.large_text || activity.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/idle-vscode.png";
                    }}
                  />
                ) : (
                  getActivityIcon(activity, isSpotify)
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <h3 className="text-base font-medium leading-tight truncate">{activity?.name || "Not active"}</h3>
                <p className="text-xs text-muted-foreground leading-tight truncate">{activity?.details || (isSpotify ? "Listening to Spotify" : "")}</p>
                {activity?.state && !isSpotify && (
                  <p className="text-xs text-muted-foreground leading-tight truncate">{activity.state}</p>
                )}
                {(activity?.timestamps?.start || (isSpotify && lanyardData?.spotify?.timestamps?.start)) && (
                  <p className="text-xs font-medium text-primary leading-tight truncate">{elapsed} elapsed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </HoverFx>
    </motion.div>
  );
}
