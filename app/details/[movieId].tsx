
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface MovieDetails{
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

const API_KEY = "b9bd48a6";

export default function DetailsScreen(){
  const { movieId } = useLocalSearchParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;
  console.log('the id is:', movieId);

  console.log('path:::', `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetails | null>(null);

    const fetchMoviesDetails = async (id: string) => {
    setLoading(true);
  
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const data: MovieDetails & { Response: string; Error?: string } = await response.json();

        if (data.Response === 'True') {
          setMovie(data);
        } 
      } catch (err) {
         setLoading(false);
      } finally {
        setLoading(false);
      }
  };

    useEffect(() => {
      fetchMoviesDetails(id)
    }, [id]);

    return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {movie && (
        <View style={styles.movieContainer}>
          {movie.Poster !== 'N/A' && <Image source={{ uri: movie.Poster }} style={styles.poster} />}
          <Text style={styles.title}>{movie.Title}</Text>
          <Text>Year: {movie.Year}</Text>
          <Text>Rated: {movie.Rated}</Text>
          <Text>Genre: {movie.Genre}</Text>
          <Text>Director: {movie.Director}</Text>
          <Text>Actors: {movie.Actors}</Text>
          <Text>Plot: {movie.Plot}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
  movieContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});