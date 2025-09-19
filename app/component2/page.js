"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // State variables
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch images from Unsplash API
  async function fetchImages(searchQuery = query, pageNumber = page) {
    setLoading(true);
    const endpoint = searchQuery
      ? `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${pageNumber}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      : `https://api.unsplash.com/photos?page=${pageNumber}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const newImages = data.results || data;

      setImages(prev =>
        pageNumber === 1 ? newImages : [...prev, ...newImages]
      );
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
    console.log("API Response:", data);
  }

  // Load images when query or page changes
  useEffect(() => {
    fetchImages();
  }, [page, query]);

  // Search handler
  const handleSearch = () => {
    if (!query.trim()) return;

    setPage(1);
    if (!history.includes(query)) {
      setHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  // Filter handler
  const handleFilter = category => {
    setFilter(category);
    setQuery(category === "all" ? "nature" : category);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Unsplash Gallery
          </h1>
          <p className="text-gray-600">
            Discover beautiful free images from Unsplash
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <input
              type="text"
              placeholder="Search for images..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full md:w-auto"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["all", "nature", "technology", "people", "animals", "travel"].map(
              cat => (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filter === cat
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Recent Searches */}
        {history.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {images.map((img, index) => (
                <div
                  key={img.id || index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  {img.urls?.small ? (
                    <img
                      src={img.urls.small}
                      alt={img.alt_description || "Unsplash image"}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No Image Available</p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm text-gray-600 truncate">
                      {img.alt_description || "No description"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More Images"}
              </button>
            </div>
          </>
        ) : (
          // Empty state
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <h2 className="text-xl text-gray-600 mb-4">
              {loading ? "Loading images..." : "No images found"}
            </h2>
            <p className="text-gray-500">
              Try searching for something else or browse using the categories
              above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
