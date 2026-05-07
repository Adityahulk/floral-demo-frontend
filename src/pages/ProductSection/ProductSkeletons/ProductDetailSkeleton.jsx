export default function ProductDetailSkeleton() {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", background: "var(--color-beige)", minHeight: "100vh" }}
      className="animate-pulse"
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-3 w-40 bg-gray-200 rounded" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Back Button */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-8" />

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* LEFT: Images */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-gray-200">
              <div className="absolute top-4 left-4 h-5 w-20 bg-gray-300 rounded-full" />
              <div className="absolute top-4 right-4 w-10 h-10 bg-gray-300 rounded-full" />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col">
            <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />

            {/* Rating */}
            <div className="flex gap-3 mb-5">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="flex gap-3 mb-6">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-12 bg-gray-200 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 rounded" />
              <div className="h-3 w-4/6 bg-gray-200 rounded" />
            </div>

            {/* Size */}
            <div className="mb-5">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-9 w-28 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-9 h-9 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Qty + Button */}
            <div className="flex items-center gap-4 mb-5">
              <div className="h-10 w-28 bg-gray-200 rounded-full" />
              <div className="h-12 flex-1 bg-gray-200 rounded-full" />
            </div>

            {/* Buy Now */}
            <div className="h-12 w-full bg-gray-200 rounded-full mb-6" />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-2 w-12 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights + Care */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 p-8 rounded-3xl bg-gray-100">
          {[1,2].map(i => (
            <div key={i}>
              <div className="h-6 w-40 bg-gray-200 rounded mb-5" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <div className="flex justify-between mb-8">
            <div>
              <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                    <div className="h-2 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-2xl p-5">
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}