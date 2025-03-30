"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
}

// Helper function to estimate reading time based on word count
const estimateReadingTime = (description: string): number => {
  const wordsPerMinute = 200;
  const wordCount = description.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Helper function to get word count
const getWordCount = (description: string): number => {
  return description.split(/\s+/).length;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
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

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        className="space-y-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
        >
          {posts.map((post) => {
            const wordCount = getWordCount(post.description);
            const readingTime = estimateReadingTime(post.description);

            return (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="border border-border rounded-lg overflow-hidden bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {wordCount} words • {readingTime} minute{readingTime !== 1 ? 's' : ''} to read
                  </div>

                  <h2 className="text-2xl font-bold mb-2 text-primary">{post.title}</h2>

                  <div className="mb-4 text-sm text-muted-foreground">
                    Posted on {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <p className="text-foreground mb-3">{post.description}</p>

                  <div className="text-sm text-primary font-medium">
                    Read more →
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
