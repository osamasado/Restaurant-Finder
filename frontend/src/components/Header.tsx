import Navbar from "./NavBar.tsx";

export default function Header() {
    return (
        <header className="bg-slate-900 text-white py-10 px-6 shadow-lg">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Restaurant Finder
                </h1>
                <Navbar></Navbar>
            </div>
        </header>
    )
}