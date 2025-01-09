export default function manifest() {
  return {
    name: "SnapOG",
    short_name: "SnapOG",
    description:
      "SnapOG is a platform for generating social media previews automatically.",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
  };
}
