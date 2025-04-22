"use client";

import { routes } from "@/config/routes";
import { Favorite } from "@/types/backend/favorites";
import { getFavorites } from "@/utils/backend/favorites";
import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesList() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.access) {
      setIsLoading(true);
      getFavorites(session.access)
        .then((data) => {
          setFavorites(data.results || []);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch favorites:", err);
          setError("Could not load your favorite items.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Handle case where user is not logged in (though Protected should prevent this)
      setError("Please log in to see your favorites.");
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) return <div>Loading favorites...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any items to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <Card key={fav.id} isPressable className="w-full">
              <CardHeader
                as={Link}
                href={routes.menuItemDetail(fav.menuItem.id)}
                className="flex-col items-start px-4 pt-4 pb-0"
              >
                {fav.menuItem.image && (
                  <Image
                    removeWrapper
                    alt={fav.menuItem.name}
                    className="z-0 w-full h-[140px] object-cover rounded-md mb-4"
                    src={fav.menuItem.image}
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">
                  {fav.menuItem.name}
                </h2>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <p className="text-gray-600 mb-2">{fav.menuItem.description}</p>
                <p className="text-lg font-semibold text-green-600 mb-4">
                  ${fav.menuItem.price.toFixed(2)}
                </p>
                {/* You could add a button here to remove from favorites directly */}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
