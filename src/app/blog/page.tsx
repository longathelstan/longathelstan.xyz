"use client";

import BlogPageClient from "./client-page";

const mockPosts = [
  {
    id: 1,
    slug: "hello-world",
    title: "Hello World",
    description: "The first post on this blog.",
    date: "2025-03-12",
  },
  {
    id: 2,
    slug: "setting-up-arch-linux",
    title: "Setting up Arch Linux",
    description: "A guide on how to set up Arch Linux with custom DE.",
    date: "2025-03-25",
  },
  {
    id: 3,
    slug: "react-component-design",
    title: "React Component Design",
    description: "Best practices for React component design in 2023.",
    date: "2024-08-10",
  },
];

export default function BlogPage() {
  return <BlogPageClient posts={mockPosts} />;
}
