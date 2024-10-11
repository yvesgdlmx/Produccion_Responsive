import { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Asegúrate de que la ruta sea correcta

const Layout = () => {
    const [menuVisible, setMenuVisible] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRefs = {
        metas: useRef(null),
        tableros: useRef(null),
        historial: useRef(null)
    };
    const { auth, cerrarSesionAuth } = useAuth(); // Obtener el estado de autenticación

    const toggleMenu = (menu) => {
        setMenuVisible(prevMenu => (prevMenu === menu ? '' : menu));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleClickOutside = (event) => {
        const isClickInsideAnyMenu = Object.keys(menuRefs).some(
            menu => menuRefs[menu].current && menuRefs[menu].current.contains(event.target)
        );
        if (!isClickInsideAnyMenu) {
            setMenuVisible('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuItemClick = () => {
        setMenuVisible('');
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        cerrarSesionAuth();
        localStorage.removeItem('token');
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-white p-4 pt-4 pr-16 flex justify-between items-center border border-b-slate-300">
                <div className="flex items-center gap-4">
                    <Link to={'/'}>
                        <img src="/img/logo_real.png" alt="" width={180} />
                    </Link>
                    <h1 className="font-light text-xl xs:hidden sm:hidden md:block">
                        Inteligencia de negocios
                    </h1>
                </div>
                <div className="xs:block sm:block md:block lg:hidden">
                    <img 
                        src="/img/menu.png" 
                        alt="menu" 
                        className="xs:w-8 sm:w-8 md:w-10 cursor-pointer"
                        onClick={toggleMobileMenu}
                    />
                </div>
                <nav className="hidden lg:block">
                    <div className="flex gap-8 font-semibold uppercase text-sm text-gray-500">
                        <Link to={'/'}>
                            <p>Producción</p>
                        </Link>
                        {auth && auth.id && ( // Mostrar solo si está autenticado
                            <div className="relative" ref={menuRefs.metas}>
                                <button onClick={() => toggleMenu('metas')} className="hover:text-gray-900 focus:outline-none uppercase">
                                    Metas
                                </button>
                                {menuVisible === 'metas' && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                        <ul className="py-1 text-slate-700">
                                            <li>
                                                <Link to={'/surtido_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Manuales</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/tallado_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de tallado</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/generado_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Generadores</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/pulido_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Pulido</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/engraver_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Engraver</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/terminado_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de terminado</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/biselado_metas'} onClick={handleMenuItemClick}>
                                                    <p className="block px-4 py-2 hover:bg-gray-100">Biselado</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="relative" ref={menuRefs.tableros}>
                            <button onClick={() => toggleMenu('tableros')} className="hover:text-gray-900 focus:outline-none uppercase">
                                Tableros
                            </button>
                            {menuVisible === 'tableros' && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                    <ul className="py-1 text-slate-700">
                                        <li>
                                            <Link to={'/tableros_tallado'} onClick={handleMenuItemClick}>
                                                <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de tallado</p>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/tableros_terminado'} onClick={handleMenuItemClick}>
                                                <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de terminado</p>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/tableros_tallado_terminado'} onClick={handleMenuItemClick}>
                                                <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de tallado y terminado</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={menuRefs.historial}>
                            <button onClick={() => toggleMenu('historial')} className="hover:text-gray-900 focus:outline-none uppercase">
                                Historial
                            </button>
                            {menuVisible === 'historial' && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                    <ul className="py-1 text-slate-700">
                                        <li>
                                            <Link to={'/historial_por_dia'} onClick={handleMenuItemClick}>
                                                <p className="block px-4 py-2 hover:bg-gray-100">Historial por día</p>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/historial_por_rangos'} onClick={handleMenuItemClick}>
                                                <p className="block px-4 py-2 hover:bg-gray-100">Historial por rango de días</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        {auth && auth.id ? (
                            <button onClick={handleLogout} className="hover:text-gray-900 focus:outline-none uppercase">
                                Logout
                            </button>
                        ) : (
                            <Link to={'/auth'}>
                                <p>Login</p>
                            </Link>
                        )}
                    </div>
                </nav>
            </header>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-start">
                    <div className="bg-white w-64 md:w-80 h-full p-4 shadow-lg overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 border border-b-2 p-2 px-4">
                            <h2 className="text-xl font-bold text-blue-700">Menú</h2>
                            <button onClick={toggleMobileMenu} className="text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <ul className="space-y-4">
                            <li className='border-b-2 border-gray-200'>
                                <Link to={'/'} onClick={handleMenuItemClick} className="block py-3 px-4 text-blue-700 hover:bg-gray-100 font-bold uppercase">
                                    Producción
                                </Link>
                            </li>
                            {auth && auth.id && (
                                <li className='border-b-2 border-gray-200'>
                                    <p className="py-3 px-4 font-bold text-blue-700 uppercase">Metas</p>
                                    <ul className='font-bold py-4'>
                                        <li>
                                            <Link to={'/surtido_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Manuales
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/tallado_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Bloqueo de tallado
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/generado_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Generadores
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/pulido_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Pulido
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/engraver_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Engraver
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/terminado_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Bloqueo de terminado
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/biselado_metas'} onClick={handleMenuItemClick} className="block py-2 px-8 text-gray-600 hover:bg-gray-100">
                                                Biselado
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )}
                            <li className='border-b-2 border-gray-200'>
                                <p className="mx-4 font-bold text-blue-700 uppercase">Historial</p>
                                <ul className='font-bold'>
                                    <li>
                                        <Link to={'/historial_por_dia'} onClick={handleMenuItemClick} className="block py-4 px-8 text-gray-500 hover:bg-gray-100">
                                            Historial por día
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/historial_por_rangos'} onClick={handleMenuItemClick} className="block py-4 px-8 text-gray-500 hover:bg-gray-100">
                                            Historial por rango de días
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            {auth && auth.id ? (
                                <li>
                                    <button onClick={handleLogout} className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li className='bg-blue-700'>
                                    <Link to={'/auth'} onClick={handleMenuItemClick} className="block py-3 px-4 text-white font-bold text-center">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
            <main className="bg-slate-100 min-h-screen min-w-full mt-24 md:p-10 flex-1 xs:p-2 main">
                <Outlet />
                <p className="font-semibold text-center mt-6 text-gray-700">
                    Todos los derechos reservados Optimex SA de CV ©
                </p>
            </main>
        </>
    );
};

export default Layout;