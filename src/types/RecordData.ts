import { GenreData } from "./GenreData";
import { StockData } from "./StockData";

export interface RecordData {
  id: string;
  genre: GenreData;
  title: string;
  artist: string;
  description: string;
  year: number;
  stock: StockData[];
}
