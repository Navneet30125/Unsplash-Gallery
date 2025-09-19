"use client";
import { useEffect, useState } from "react";

export default function Home() {
  // State variables
  const [images, setImages] = useState([]); // store all fetched images
  const [query, setQuery] = useState("nature"); // default search query
  const [page, setPage] = useState(1); // current page number for pagination

  // Fetch images from Unsplash
  async function fetchImages() {
    // endpoint bana rahe hain -> agar query hai to search API, warna normal photos API
    const endpoint = query
      ? `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      : `https://api.unsplash.com/photos?page=${page}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`;

    // API call
    const res = await fetch(endpoint);
    const data = await res.json(); // zaroori hai `await`, warna ye Promise return karega
    console.log("API Response:", data);

    // agar search API use ho rahi hai to data.results me hota hai
    const newImages = data.results ? data.results : data;

    // naye images purane ke saath merge karna (infinite scroll / load more)
    setImages(prev => [...prev, ...newImages]);
  }

  // Jab bhi page ya query change hoga, images fetch karo
  useEffect(() => {
    fetchImages();
  }, [page, query]);

  // Jab naya search karna ho
  const handleSearch = () => {
    setImages([]); // purane results clear
    setPage(1); // page reset
    // fetchImages() yaha call nahi karna, kyunki query ya page change hone par useEffect khud fetch karega
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unsplash Gallery</h1>

      {/* Search bar */}
      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={e => setQuery(e.target.value)} // query update
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={img.id || index} // React key unique honi chahiye
            className="overflow-hidden rounded-lg shadow-md"
          >
            {img.urls?.small ? (
              <img
                src={img.urls.small}
                alt={img.alt_description || "Unsplash image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-sm text-gray-500">No Image Available</p>
            )}
          </div>
        ))}
      </div>

      {/*  Load More Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(prev => prev + 1)} // page increment
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Load More
        </button>
      </div>
    </main>
  );
}
