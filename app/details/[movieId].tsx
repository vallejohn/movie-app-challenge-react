
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addFavorite, initDb, isMarkedFavorite, removeFavorite } from '../_database';
import { MovieDetails } from "../models/movieDetails";

const API_KEY = "b9bd48a6";

export default function DetailsScreen(){
  const { movieId } = useLocalSearchParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;
  console.log('the id is:', movieId);

  console.log('path:::', `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

    const fetchMoviesDetails = async (id: string) => {
    setLoading(true);
    console.log('fetching::::::')
  
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const data: MovieDetails & { Response: string; Error?: string } = await response.json();
          console.log('fetching 1::::::')
        if (data.Response === 'True') {
          console.log('fetching 2::::::')
          setMovie(data);
          let markedFavorite = await isMarkedFavorite(data.imdbID);

          console.log('marked favorite', markedFavorite);

          if(markedFavorite){
            setIsFavorite(true);
          }
        } 
      } catch (err) {
         setLoading(false);
      } finally {
        setLoading(false);
      }
  };

    useEffect(() => {
      const setup = async () => {
        await initDb();
        fetchMoviesDetails(id)
      }

      setup();
    }, [id]);

    const toggleFavorite = async () => {
      if (!movie) return;

      if (isFavorite) {
        await removeFavorite(movie.imdbID);
      } else {
        await addFavorite(movie.imdbID, movie);
      }
      setIsFavorite(!isFavorite);
    };

    return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {movie && (
        <View style={styles.movieContainer}>
          {movie.Poster !== 'N/A' && <Image source={{ uri: movie.Poster }} style={styles.poster} />}
          <Text style={styles.title}>{movie.Title}</Text>
          <TouchableOpacity style={isFavorite? styles.favoritedIcon : styles.favoritedIconDefault} onPress={toggleFavorite}>
            <Ionicons name="heart" size={28} color={isFavorite? "white" : "#007AFF"} />
          </TouchableOpacity>
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
  favoritedIcon: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritedIconDefault: {
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    outlineColor: "#007AFF",
    outlineWidth: 1.3
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