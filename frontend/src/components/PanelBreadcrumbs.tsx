import { Link } from "react-router";
import type { TPanelCrumb } from "../types/ui.type";

export default function PanelBreadcrumbs({ items }: { items: TPanelCrumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500">
            {items.map((item, i) => {
                const last = i === items.length - 1;
                return (
                    <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-gray-400">/</span>}
                        {item.to && !last ? (
                            <Link to={item.to} className="font-medium text-blue-500 hover:text-blue-600 transition">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={last ? "text-gray-700 font-medium" : ""}>{item.label}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
