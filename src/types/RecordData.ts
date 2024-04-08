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

export interface GetRecords {
  limit: number;
  offset: number;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
}
