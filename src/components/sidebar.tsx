"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Box, Github, Facebook, Ship } from "lucide-react";
import { Image } from "@/components/ui/image";
import { motion } from "framer-motion";
import { SocialButton } from "@/components/ui/social-button";

export default function Sidebar() {
  const socialLinks = [
    {
      href: "https://namemc.com/profile/tlowng",
      title: "Minecraft",
      icon: <Box className="h-5 w-5" />,
    },
    {
      href: "https://github.com/longathelstan",
      title: "GitHub",
      icon: <Github className="h-5 w-5" />,
    },
    {
      href: "https://facebook.com/longathelstan",
      title: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
    },
    {
      href: "https://hub.docker.com/r/longathelstan",
      title: "DockerHub",
      icon: <Ship className="h-5 w-5" />,
    },
  ];

  return (
    <motion.aside
      className="w-full md:w-64 flex flex-col items-center md:items-start md:sticky md:top-20 self-start mb-8 md:mb-0 p-6 rounded-xl bg-card shadow-sm border border-border"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-col items-center md:items-start space-y-2 mb-6 w-full">
        <motion.div
          className="w-40 h-40 relative rounded-lg overflow-hidden bg-[#ffde9c]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/images/awl.jpg"
            alt="Capoo"
            width={160}
            height={160}
            className="object-cover"
            unoptimized
          />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-center md:text-left mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Lowng
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Separator className="my-1 bg-primary h-1 rounded-lg" />
        </motion.div>

        <motion.p
          className="text-muted-foreground text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          amateur web & game developer 
        </motion.p>
      </div>

      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {socialLinks.map((link, index) => (
          <SocialButton
            key={link.href}
            href={link.href}
            title={link.title}
            icon={link.icon}
          />
        ))}
      </motion.div>
    </motion.aside>
  );
}
