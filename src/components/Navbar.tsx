
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <nav className="bg-coffee text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo-parque-cafe.png" 
            alt="Logo Parque del Café" 
            className="h-10 w-auto" 
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/40x40?text=PC";
            }}
          />
          <span className="font-bold text-xl">Parque del Café</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-accent2 transition-colors">Inicio</Link>
          <Link to="/inspecciones" className="hover:text-accent2 transition-colors">Inspecciones</Link>
          <Link to="/solicitudes" className="hover:text-accent2 transition-colors">Solicitudes</Link>
          <Link to="/registradora" className="hover:text-accent2 transition-colors">Registradora</Link>
          <Link to="/reportes" className="hover:text-accent2 transition-colors">Reportes</Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
