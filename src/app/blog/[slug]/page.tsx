import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ClientBlogPost from "./client-page";

// Sample blog post data - in a real app, this would come from a database or CMS
const mockPosts = {
  "hello-world": {
    title: "Hello World",
    date: "2023-03-12",
    content: `
      <p>This is my first blog post. Welcome to my blog!</p>
      <p>I plan to write about technology, programming, and other topics that interest me.</p>
      <h2>Why I Started This Blog</h2>
      <p>I've always enjoyed writing and sharing my knowledge with others. This blog is a way for me to document my journey and share what I learn along the way.</p>
      <p>I hope you find something useful here!</p>
    `,
  },
  "setting-up-arch-linux": {
    title: "Setting up Arch Linux",
    date: "2023-03-25",
    content: `
      <p>In this guide, I'll walk you through the process of setting up Arch Linux with a custom desktop environment.</p>
      <h2>Prerequisites</h2>
      <p>Before we begin, you'll need:</p>
      <ul>
        <li>A USB drive (at least 4GB)</li>
        <li>An internet connection</li>
        <li>Patience (very important!)</li>
      </ul>
      <h2>Step 1: Download Arch Linux</h2>
      <p>First, download the latest Arch Linux ISO from the official website...</p>
    `,
  },
  "react-component-design": {
    title: "React Component Design",
    date: "2023-04-10",
    content: `
      <p>Designing effective React components is crucial for building maintainable and reusable code.</p>
      <h2>Component Composition</h2>
      <p>One of the most powerful patterns in React is component composition. This allows you to create small, focused components that can be combined to build complex UIs.</p>
      <h2>Custom Hooks</h2>
      <p>Custom hooks allow you to extract reusable logic from components, making them cleaner and more focused on rendering.</p>
      <h2>Conclusion</h2>
      <p>By following these best practices, you can create React components that are easier to maintain, test, and reuse.</p>
    `,
  },
};

// This function is needed for static site generation with [slug]
export function generateStaticParams() {
  return Object.keys(mockPosts).map((slug) => ({
    slug,
  }));
}

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = params;
  const post = mockPosts[slug as keyof typeof mockPosts];

  if (!post) {
    notFound();
  }

  return <ClientBlogPost post={post} />;
}
