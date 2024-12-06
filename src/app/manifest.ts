export default function manifest() {
  return {
    name: "Snap OG",
    short_name: "Snap OG",
    description:
      "Snap OG is a platform for generating social media previews automatically.",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
  };
}
