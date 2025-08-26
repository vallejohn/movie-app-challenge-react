import Constants from "expo-constants";
import MovieDetails from "./models/movieDetails";
import OmdbResponse from "./models/omdbResponse";
const { omdbApiKey } = Constants.expoConfig?.extra ?? {};

const API_KEY = omdbApiKey;

export async function onRequestMovieList(searchValue: string, year: number, type: string, pageNumber: number): Promise<OmdbResponse | null> {
    if (!searchValue && year == 0) return null;

    console.log("tyoes", type);

    let yearParam = ``;
    if (year != null || year != 0) {
        yearParam = `&y=${year}`;
    }
    let typeParam = ``;
    if (type != null || type != "") {
        typeParam = `&type=${type}`;
    }

    try {
        const response = await fetch(
            `http://www.omdbapi.com/?s=${searchValue}${yearParam}${typeParam}&page=${pageNumber}&apikey=${API_KEY}`
        );
        const data: OmdbResponse = await response.json();

        if (data.Response === "True" && data.Search) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function onRequestDetails(id: string): Promise<MovieDetails | null> {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const data: MovieDetails & { Response: string; Error?: string } = await response.json();
        if (data.Response === 'True') {
            return data;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}