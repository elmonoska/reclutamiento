import { Link } from "react-router";
import { APP_NAME } from "../constants"

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-300">
            <div className="w-full md:max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div>
                    <Link to="/" className="text-3xl font-bold text-gray-900">{APP_NAME}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ul className="flex items-center gap-4">
                        <Link to="/"></Link>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
