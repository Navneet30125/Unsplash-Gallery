"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&per_page=12`
      );
      const data = await res.json();
      setImages(data);
    }
    fetchImages();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unsplash Gallery</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="overflow-hidden rounded-lg shadow-md">
            <img
              src={img.urls.small}
              alt={img.alt_description || "Unsplash Image"}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
