
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttractionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const atracciones = [
  "Montaña Rusa",
  "Carrusel",
  "Torre de Caída",
  "Rueda de Chicago",
  "Teleférico",
  "Barco Vikingo",
  "Rapids",
  "Karts",
  "Krater",
  "Yippe"
];

const AttractionSelector: React.FC<AttractionSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar atracción" />
      </SelectTrigger>
      <SelectContent>
        {atracciones.map((atraccion) => (
          <SelectItem key={atraccion} value={atraccion}>
            {atraccion}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AttractionSelector;
