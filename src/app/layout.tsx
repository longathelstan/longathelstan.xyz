import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import ClientBody from "./ClientBody";

export const metadata = {
  title: "Lowng",
  description: "og nay biet longathelstan k?",
  keywords: "longathelstan, tlowng, developer, tech, coding, blog, portfolio",
  site_name: "@longathelstan",
  openGraph: {
    title: "Lowng",
    description: "og nay biet longathelstan k?",
    url: "https://longathelstan.xyz",
    images: [ 
      {
        url: "https://longathelstan.xyz/images/awl.jpg",
        width: 630,
        height: 630,
        alt: "Lowng",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@longathelstan",
    creator: "@longathelstan",
    title: "Lowng",
    description: "og nay biet longathelstan k?",
    images: [
      {
        url: "https://longathelstan.xyz/images/awl.jpg",
        width: 630,
        height: 630,
        alt: "Lowng",
      },
    ],

  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientBody>
        <ThemeProvider>
          <div className="theme-transition">
            <Header />
            <div className="flex min-h-screen w-full flex-col md:flex-row max-w-6xl mx-auto px-4 py-4 gap-8">
              <Sidebar />
              <main className="flex-1 md:pl-8">
                <article id="main-content" className="mb-16">
                  {children}
                </article>
              </main>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </ClientBody>
    </html>
  );
}
