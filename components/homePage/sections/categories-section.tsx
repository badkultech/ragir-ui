import { CategoryCard } from "@/components/homePage/shared/category-card";

const categories = [
  {
    title: "Water Sports",
    image: "/travel.jpg",
    icon: "Snowflake",
  },
  {
    title: "Desert Discoveries",
    image: "/desert-safari-sand-dunes-adventure.jpg",
    icon: "Tag",
  },
  {
    title: "Popular Trips",
    image: "/popular-travel-destination-mountains.jpg",
    icon: "Telescope",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
