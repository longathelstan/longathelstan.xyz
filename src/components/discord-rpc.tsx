"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Music, Terminal, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HoverFx } from "@/components/ui/hover-fx";
import dynamic from 'next/dynamic';

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
  application_id?: string; // Added for handling application assets
}

// Add a new function to detect if an image URL is an emoji
const isEmojiUrl = (url: string): boolean => {
  return url.startsWith("https://cdn.discordapp.com/emojis/");
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

// ScrollingText component for handling long text with animation
interface ScrollingTextProps {
  text: string;
  className?: string;
  speed?: number; // Speed in pixels per second
  pauseOnHover?: boolean;
  maxWidth?: string; // Max width for the container
  forceScroll?: boolean; // Force scrolling even if text doesn't overflow
  disableScroll?: boolean; // Disable scrolling effect regardless of overflow
}

const ScrollingText = ({
  text,
  className = "",
  speed = 40,
  pauseOnHover = true,
  maxWidth = "100%",
  forceScroll = false,
  disableScroll = false
}: ScrollingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Check if text overflows container and update dimensions
  const checkOverflow = () => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const textWidth = textRef.current.scrollWidth;

    setContainerWidth(containerWidth);
    setTextWidth(textWidth);
    setIsOverflowing(textWidth > containerWidth || forceScroll);
  };

  // Run the overflow check when the text changes or window resizes
  useEffect(() => {
    // Initial check
    checkOverflow();

    // Also check after a brief delay to account for font loading
    const timeoutId = setTimeout(checkOverflow, 500);

    // Add resize listener to handle window size changes
    window.addEventListener('resize', checkOverflow);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text, forceScroll]);

  // Calculate animation duration based on text length and speed
  const duration = Math.max((textWidth / speed) * 1.5, 5);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap relative ${className}`}
      style={{ maxWidth }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {isOverflowing && !disableScroll ? (
        <div
          ref={textRef}
          className="inline-block"
          style={{
            animation: `marquee ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {text}
          <span className="inline-block px-4">{text}</span>
        </div>
      ) : (
        <div ref={textRef} className="truncate">
          {text}
        </div>
      )}
    </div>
  );
};

// Get status color and animation for various Discord statuses
const getStatusStyles = (status: string) => {
  switch(status) {
    case "online":
      return {
        color: "bg-green-500",
        animation: ""
      };
    case "idle":
      return {
        color: "bg-yellow-500",
        animation: ""
      };
    case "dnd":
      return {
        color: "bg-red-500",
        animation: ""
      };
    case "streaming":
      return {
        color: "bg-purple-500",
        animation: "animate-blink"
      };
    default:
      return {
        color: "bg-gray-500",
        animation: ""
      };
  }
};

// Get status color and animation for Discord status
const getStatusColor = (status: string) => {
  const styles = getStatusStyles(status);
  return styles.color;
};

const DiscordRPCClient = () => {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [elapsed, setElapsed] = useState<string>("a few seconds");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverButton, setHoverButton] = useState(false);

  const userId = "1003289653014691911";

  const fetchLanyardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching Lanyard data for user:", userId);

      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        console.error(`Failed to fetch Discord status: ${response.status} ${response.statusText}`);
        setError(`Failed to fetch Discord status: ${response.status} ${response.statusText}`);
        return; // Don't throw, just return
      }

      const data = await response.json();

      if (data.success) {
        console.log("Lanyard data retrieved successfully");

        // Log the activities to help with debugging
        if (data.data.activities && data.data.activities.length > 0) {
          console.log("Activities found:", data.data.activities);
          data.data.activities.forEach((activity, index) => {
            if (activity.assets) {
              console.log(`Activity ${index} assets:`, activity.assets);

              // Preview the formatted large image URL if present
              if (activity.assets.large_image) {
                const formattedUrl = formatImageUrl(activity.assets.large_image, activity);
                console.log(`Activity ${index} large image URL:`, formattedUrl);
              }

              // Preview the formatted small image URL if present
              if (activity.assets.small_image) {
                const formattedUrl = formatImageUrl(activity.assets.small_image, activity);
                console.log(`Activity ${index} small image URL:`, formattedUrl);
              }
            }
          });
        } else {
          console.log("No activities found in Lanyard data");
        }

        setLanyardData(data.data);

        // Update elapsed time based on fetched data
        updateElapsedTime(data.data);
      } else {
        console.error(`API returned unsuccessful response: ${JSON.stringify(data)}`);
        setError(`API returned unsuccessful response: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error("Fetch request timed out");
        setError("Fetch request timed out");
      } else {
        console.error("Error fetching Lanyard data:", err);
        setError("Error fetching Lanyard data");
      }
    } finally {
      setLoading(false);
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
  const formatImageUrl = (imageUrl: string | undefined, activity: DiscordActivity | null): string => {
    if (!imageUrl) return "";

    // If it's already a proper URL, return it
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Handle Discord emojis (emoji IDs)
    if (/^\d+$/.test(imageUrl)) {
      return `https://cdn.discordapp.com/emojis/${imageUrl}.webp?size=128`;
    }

    // Handle external images that come with mp: prefix
    if (imageUrl.startsWith("mp:")) {
      // Extract the actual URL part
      const matches = imageUrl.match(/https?:\/\/[^/]+(\/.*)/);
      if (matches && matches[0]) {
        return matches[0];
      }

      // For mp:attachments
      if (imageUrl.startsWith("mp:attachments/")) {
        const attachmentId = imageUrl.replace("mp:attachments/", "");
        return `https://media.discordapp.net/attachments/${attachmentId}`;
      }

      // Handle mp:external URLs for YouTube, Twitch, etc.
      if (imageUrl.startsWith("mp:external/")) {
        const externalUrl = imageUrl.replace("mp:external/", "");
        if (externalUrl.includes("youtube.com") || externalUrl.includes("youtu.be")) {
          // Extract video ID for YouTube thumbnails
          const videoId = externalUrl.split("/").pop();
          if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
      }

      // If we couldn't extract a URL, return a fallback
      return "https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/idle-vscode.png";
    }

    // Handle Spotify images
    if (imageUrl.startsWith("spotify:")) {
      return `https://i.scdn.co/image/${imageUrl.substring(8)}`;
    }

    // Handle Discord CDN custom app assets
    if (imageUrl.includes("/")) {
      const [appId, assetId] = imageUrl.split("/");
      return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.webp`;
    }

    // Handle raw application assets (for verified/partnered apps)
    if (activity?.application_id) {
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imageUrl}.webp`;
    }

    // Fallback to a default image if we can't determine the format
    return "https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/idle-vscode.png";
  };

  useEffect(() => {
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
  }, []); // Empty dependency array to run only once on mount

  // Update elapsed time separately when lanyardData changes
  useEffect(() => {
    if (lanyardData) {
      updateElapsedTime(lanyardData);
    }
  }, [lanyardData]);

  // Find the main activity to display
  const getMainActivity = (): { activity: DiscordActivity | null, isSpotify: boolean } => {
    if (!lanyardData) {
      return {
        activity: {
          id: "placeholder",
          name: "Code",
          type: 0,
          details: "Idling",
          state: "Status data unavailable"
        },
        isSpotify: false
      };
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

    return {
      activity: {
        id: "offline",
        name: "Offline",
        type: 0,
        details: "Not currently active",
        state: "Will be back soon"
      },
      isSpotify: false
    };
  };

  // Get activity icon
  const getActivityIcon = (activity: DiscordActivity | null, isSpotify: boolean) => {
    if (!activity) return <Activity size={24} className="text-primary" />;

    if (isSpotify) {
      return <Music size={24} className="text-primary" />;
    }

    switch(activity.name) {
      case "Code":
      case "Visual Studio Code":
        return <Code size={24} className="text-primary" />;
      case "Spotify":
        return <Music size={24} className="text-primary" />;
      case "Terminal":
      case "Windows Terminal":
      case "Konsole":
      case "iTerm2":
        return <Terminal size={24} className="text-primary" />;
      default:
        return <Activity size={24} className="text-primary" />;
    }
  };

  const { activity, isSpotify } = getMainActivity();

  // Return the fully rendered component without conditional early return
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <HoverFx glowSize={80} glowOpacity={0.1} glowColor="var(--primary)">
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden w-full">
          <div className="flex items-center p-2 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2 max-w-[80%]">
              <div className="w-8 h-8 min-w-8 overflow-hidden relative">
                {lanyardData?.discord_user?.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${userId}/${lanyardData.discord_user.avatar}.webp?size=80`}
                    alt={lanyardData?.discord_user?.global_name || lanyardData?.discord_user?.username || "longathelstan"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-lg font-bold">
                    L
                  </div>
                )}

                {/* Status indicator moved to bottom right of avatar */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                    lanyardData
                      ? `${getStatusStyles(lanyardData.discord_status).color} ${getStatusStyles(lanyardData.discord_status).animation}`
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>

              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="relative group">
                    <span
                      className="font-medium text-sm truncate"
                      title={`@${lanyardData?.discord_user?.username || "longathelstan"}`}
                    >
                      @{lanyardData?.discord_user?.username || "longathelstan"}
                    </span>
                  </div>
                  <span className="text-primary shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-1 -mt-0.5">
                  <ScrollingText
                    text={activity?.state || "2025 target: pass CHT"}
                    className="text-xs text-muted-foreground"
                    maxWidth="10rem"
                    forceScroll={true}
                  />
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
                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
              <div className="mr-2.5 w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center relative">
                {loading ? (
                  <div className="animate-pulse flex items-center justify-center w-full h-full">
                    <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                  </div>
                ) : activity?.assets?.large_image ? (
                  <img
                    src={formatImageUrl(activity.assets.large_image, activity)}
                    alt={activity.assets.large_text || activity.name}
                    className={`w-full h-full ${isEmojiUrl(formatImageUrl(activity.assets.large_image, activity)) ? 'p-2' : 'object-contain'}`}
                    onError={(e) => {
                      console.error(`Failed to load image: ${(e.target as HTMLImageElement).src}`);
                      (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/idle-vscode.png";
                    }}
                  />
                ) : (
                  getActivityIcon(activity, isSpotify)
                )}

                {/* Small image overlay in bottom right with status-like styling */}
                {activity?.assets?.small_image && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full overflow-hidden bg-card border-2 border-card shadow-sm">
                    <img
                      src={formatImageUrl(activity.assets.small_image, activity)}
                      alt={activity.assets.small_text || ""}
                      className={`w-full h-full ${isEmojiUrl(formatImageUrl(activity.assets.small_image, activity)) ? 'p-0.5' : 'object-cover'}`}
                      onError={(e) => {
                        console.error(`Failed to load small image: ${(e.target as HTMLImageElement).src}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                {/* Name without scrolling */}
                <ScrollingText
                  text={activity?.name || "Not active"}
                  className="text-base font-medium leading-tight"
                  maxWidth="100%"
                  disableScroll={true}
                />
                {/* All other text with forced scrolling */}
                <ScrollingText
                  text={activity?.details || (isSpotify ? "Listening to Spotify" : "")}
                  className="text-xs text-muted-foreground leading-tight"
                  maxWidth="100%"
                  forceScroll={true}
                />
                {activity?.state && !isSpotify && (
                  <ScrollingText
                    text={activity.state}
                    className="text-xs text-muted-foreground leading-tight"
                    maxWidth="100%"
                    forceScroll={true}
                  />
                )}
                {(activity?.timestamps?.start || (isSpotify && lanyardData?.spotify?.timestamps?.start)) && (
                  <ScrollingText
                    text={`${elapsed} elapsed`}
                    className="text-xs font-medium text-primary leading-tight"
                    maxWidth="100%"
                    speed={30}
                    forceScroll={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </HoverFx>
    </motion.div>
  );
};

// Export a no-SSR version of the component
const DiscordRPC = dynamic(() => Promise.resolve(DiscordRPCClient), {
  ssr: false,
  loading: () => (
    <div className="w-full mt-3">
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden w-full animate-pulse">
        <div className="h-12 bg-muted/20 border-b border-border"></div>
        <div className="p-2.5">
          <div className="flex items-start">
            <div className="w-12 h-12 mr-2.5 rounded-md bg-muted/40"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted/40 rounded w-1/3"></div>
              <div className="h-3 bg-muted/40 rounded w-1/2"></div>
              <div className="h-3 bg-muted/40 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default DiscordRPC;
