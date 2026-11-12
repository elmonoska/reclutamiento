import { Link } from "react-router";

export default function PanelIndexPage() {
    return (
        <>
            <div className="">
                <section className="flex items-center justify-between">
                    <h2 className="">Panel de vacantes</h2>
                    <div className="">
                        <Link 
                            to="/panel/vacantes/crear"
                            className="inline-block text-sm transitionw-full bg-orange-500 hover:bg-orange-600 text-white font-semibold p-3 rounded-lg transition duration-200 shadow-sm cursor-pointer"
                        >
                            Crear vacante
                        </Link>
                    </div>
                </section>
                <section className="">
                    <h3 className="">Ultimas vacantes</h3>
                </section>
                <section className="">
                    <h3 className="">Listado de vacantes</h3>
                </section>
            </div>
        </>
    )
}