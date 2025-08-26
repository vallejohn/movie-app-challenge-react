import { Movie } from "./movie";

export interface OmdbResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
}