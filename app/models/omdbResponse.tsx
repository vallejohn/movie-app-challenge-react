import Movie from "./movie";


export default interface OmdbResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
}