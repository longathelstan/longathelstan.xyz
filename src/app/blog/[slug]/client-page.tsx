"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

// Helper function to estimate reading time based on word count
const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Helper function to get word count
const getWordCount = (content: string): number => {
  return content.split(/\s+/).length;
};

export default function ClientBlogPost({ post }: { post: BlogPost }) {
  const wordCount = getWordCount(post.content);
  const readingTime = estimateReadingTime(post.content);

  return (
    <motion.article
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blog
        </Link>
      </motion.div>

      <motion.header
        className="mb-8 border border-border rounded-lg p-6 bg-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="mb-2 text-xs text-muted-foreground">
          {wordCount} words • {readingTime} minute{readingTime !== 1 ? 's' : ''} to read
        </div>

        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

        <div className="text-sm text-muted-foreground">
          Posted on{" "}
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </motion.header>

      <motion.div
        className="prose prose-lg max-w-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.article>
  );
}
