"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import { useState } from "react";
import { HoverFx } from "@/components/ui/hover-fx";

const codeBlockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function HomeClient() {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleCopy = () => {
    const codeContent = `Me (
    aliases: ["longathelstan", "lowng", "tlowng"],
    pronouns: "he/him",
    works: ["sec schooler", "amateur mern-stack developer"],
    location: "vietnam",
    interests: {
        "frameworks": ["reactjs", "nextjs", "svelte", "TailwindCSS"],
        "languages": ["javascript", "typescript", "py", "rust", "cpp", "java", "kotlin"],
        "devops": ["git", "bash", "googleconsole"],
    },
    contacts: {
        "email": ["mail@longathelstan.xyz"]
    }
)`;

    navigator.clipboard.writeText(codeContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <motion.article
      className="prose"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      <motion.section variants={textVariants}>
        <motion.h2
          className="text-2xl font-bold mb-4"
          id="nơi-mình-nói-chuyện-xàm-và-chia-sẻ-một-số-kinh-nghiệm-về-coding-sysadmin-hackintosh-và-nhiều-thứ-khác-"
        >
          <motion.a
            className="autolink-anchor"
            aria-label="Permalink"
            href="#nơi-mình-nói-chuyện-xàm-và-chia-sẻ-một-số-kinh-nghiệm-về-coding-sysadmin-hackintosh-và-nhiều-thứ-khác-"
            whileHover={{ scale: 1.1 }}
          ></motion.a>
        Nơi show profile tui, tám nhảm và chia sẻ kinh nghiệm về coding, sysadmin cùng nhiều thứ hay ho khác. Xin được chân thành cảm ơn anh Necron vì đã cho e ý tưởng design 🤡
        </motion.h2>

        <motion.figure
          className="my-6 relative"
          variants={codeBlockVariants}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <figcaption className="flex items-center gap-2 mb-0 text-sm bg-card border border-border rounded-t-md px-4 py-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-6 h-6 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                </svg>
              </span>
              <span className="text-muted-foreground">About me :D</span>
            </motion.div>
          </figcaption>
          <HoverFx glowSize={120} glowOpacity={0.1} glowColor="var(--accent)">
            <pre className="text-sm rounded-b-md p-4 overflow-x-auto bg-muted/80 border border-t-0 border-border">
            <code className="language-rust">
              <span className="text-primary italic">Me</span>
              <span className="text-slate-500 dark:text-slate-400"> (</span>
              {'\n'}
              <span className="text-slate-700 dark:text-slate-300">    aliases</span>
              <span className="text-teal-500 dark:text-teal-400">:</span>
              <span className="text-slate-500 dark:text-slate-400"> [</span>
              <span className="text-green-600 dark:text-green-400">"longathelstan"</span>
              <span className="text-slate-500 dark:text-slate-400">,</span>
              <span className="text-green-600 dark:text-green-400"> "lowng"</span>
              <span className="text-slate-500 dark:text-slate-400">,</span>
              <span className="text-green-600 dark:text-green-400"> "tlowng"</span>
              <span className="text-slate-500 dark:text-slate-400">],</span>
  {'\n'}
  <span className="text-slate-700 dark:text-slate-300">    pronouns</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-green-600 dark:text-green-400"> "he/him"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  {'\n'}
  <span className="text-slate-700 dark:text-slate-300">    works</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> [</span>
  <span className="text-green-600 dark:text-green-400">"sec schooler"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "amateur mern-stack developer"</span>
  <span className="text-slate-500 dark:text-slate-400">],</span>
  {'\n'}
  <span className="text-slate-700 dark:text-slate-300">    location</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-green-600 dark:text-green-400"> "vietnam"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  {'\n'}
  <span className="text-slate-700 dark:text-slate-300">    interests</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> {'{'}</span>
  {'\n'}
  <span className="text-green-600 dark:text-green-400">        "frameworks"</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> [</span>
  <span className="text-green-600 dark:text-green-400">"reactjs"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "nextjs"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "svelte"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "TailwindCSS"</span>
  <span className="text-slate-500 dark:text-slate-400">],</span>
  {'\n'}
  <span className="text-green-600 dark:text-green-400">        "languages"</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> [</span>
  <span className="text-green-600 dark:text-green-400">"javascript"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "typescript"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "py"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "rust"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "cpp"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "java"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "kotlin"</span>
  <span className="text-slate-500 dark:text-slate-400">],</span>
  {'\n'}
  <span className="text-green-600 dark:text-green-400">        "devops"</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> [</span>
  <span className="text-green-600 dark:text-green-400">"git"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "bash"</span>
  <span className="text-slate-500 dark:text-slate-400">,</span>
  <span className="text-green-600 dark:text-green-400"> "googleconsole"</span>
  <span className="text-slate-500 dark:text-slate-400">]</span>
  {'\n'}
  <span className="text-slate-500 dark:text-slate-400">    {'}'},</span>
  {'\n'}
  <span className="text-slate-700 dark:text-slate-300">    contacts</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> {'{'}</span>
  {'\n'}
  <span className="text-green-600 dark:text-green-400">        "email"</span>
  <span className="text-teal-500 dark:text-teal-400">:</span>
  <span className="text-slate-500 dark:text-slate-400"> [</span>
  <span className="text-green-600 dark:text-green-400">"mail@longathelstan.xyz"</span>
  <span className="text-slate-500 dark:text-slate-400">]</span>
  {'\n'}
  <span className="text-slate-500 dark:text-slate-400">    {'}'}</span>
  {'\n'}
  <span className="text-slate-500 dark:text-slate-400">)</span>
</code>
            </pre>
          </HoverFx>

          <AnimatePresence>
            <motion.button
              type="button"
              title="Copy"
              aria-label="Copy"
              className="absolute right-4 top-1 p-2 rounded-md bg-accent/0 hover:bg-accent transition-colors flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              initial={{ opacity: isHovering ? 1 : 0 }}
              animate={{
                opacity: isHovering || isCopied ? 1 : 0,
                scale: isCopied ? 1.1 : 1
              }}
              transition={{
                opacity: { duration: 0.2 },
                scale: { type: "spring", stiffness: 200, damping: 10 }
              }}
            >
              <Copy size={16} />
              <AnimatePresence>
                {isCopied && (
                  <motion.span
                    className="ml-2 text-xs"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </AnimatePresence>
        </motion.figure>
      </motion.section>
    </motion.article>
  );
}
