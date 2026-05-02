import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ paths }) => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f5ede5", borderBottom: "1px solid #e8d5c4" }} className="py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm" style={{ color: "#9c7a62" }}>
        {paths.map((p, i) => {
          // 🔥 yaha magic ho raha hai
          const fullPath = paths
            .slice(0, i + 1)
            .map(item => item.path.replace(/^\//, ""))
            .filter(Boolean)
            .join("/");

          return (
            <span key={p.id} className="flex items-center gap-2">
              <p
                onClick={() => navigate(`/${fullPath}`)}
                className={`hover:underline cursor-pointer ${i === paths.length - 1 ? "text-gray-800 font-medium" : "text-gray-500"}`}
              >
                {p.name}
              </p>
              {i < paths.length - 1 && <span>/</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;