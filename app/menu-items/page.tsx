"use client";

import { MenuItem } from "@/types/backend/menuItems";
import { getMenuItems } from "@/utils/backend/menuItems";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems();
      setMenuItems(response.results);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <button
          onClick={() => router.push("/menu-items/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-lg font-semibold text-green-600 mb-4">
              ${item.price.toFixed(2)}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/menu-items/${item.id}/edit`)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => router.push(`/menu-items/${item.id}`)}
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
