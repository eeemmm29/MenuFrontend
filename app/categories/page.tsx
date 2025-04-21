"use client";

import { getCategories } from "@/utils/backend/categories";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Categories</h1>
        <button
          onClick={() => router.push("/categories/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/categories/${category.id}/edit`)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => router.push(`/categories/${category.id}`)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
