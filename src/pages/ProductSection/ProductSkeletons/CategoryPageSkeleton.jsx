import ProductCardSkeleton from "./ProductCardSkeleton";

export default function CategoryPageSkeleton() {
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"var(--color-beige)", minHeight:"100vh" }} className="animate-pulse">

      {/* Breadcrumb */}
      <div style={{ background:"var(--color-beige)", borderBottom:"1px solid var(--color-border)" }} className="py-3">
        <div className="max-w-7xl mx-auto px-4 flex gap-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-40 sm:h-52 overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-52 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="h-10 flex-1 bg-gray-200 rounded-full" />
          <div className="h-10 w-36 bg-gray-200 rounded-full" />
          <div className="h-10 w-28 bg-gray-200 rounded-full" />
          <div className="h-10 w-24 bg-gray-200 rounded-full" />
        </div>

        {/* Filter Panel */}
        {/* <div className="mb-6 p-5 rounded-2xl border bg-white" style={{ borderColor:"var(--color-border)" }}>
          <div className="grid sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                {[1,2,3].map(j => (
                  <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div> */}

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>

        {/* Result Count */}
        <div className="flex justify-between mb-5">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}