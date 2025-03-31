
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-coffee mb-4">404</h1>
        <p className="text-xl text-coffee-dark mb-6">
          Lo sentimos, la página que buscas no existe
        </p>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Es posible que la dirección haya sido escrita incorrectamente o 
          que la página haya sido movida a otra ubicación.
        </p>
        <Link to="/">
          <Button className="bg-coffee hover:bg-coffee-dark">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
