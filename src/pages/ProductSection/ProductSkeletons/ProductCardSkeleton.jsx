export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border animate-pulse"
      style={{ borderColor: "var(--color-border)" }}>
      
      {/* Image */}
      <div style={{ aspectRatio: "4/5" }} className="bg-gray-200 w-full" />

      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 w-20 bg-gray-200 rounded" />

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Rating */}
        <div className="h-3 w-1/2 bg-gray-200 rounded" />

        {/* Price */}
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>

        {/* Button */}
        <div className="h-8 w-full bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}