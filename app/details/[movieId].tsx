
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addFavorite, initDb, isMarkedFavorite, removeFavorite } from '../_database';
import MovieDetails from "../models/movieDetails";
const { width } = Dimensions.get("window");

import Constants from "expo-constants";
const { omdbApiKey } = Constants.expoConfig?.extra ?? {};

const API_KEY = omdbApiKey;

export default function DetailsScreen() {
  const { movieId } = useLocalSearchParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchMoviesDetails = async (id: string) => {
    setLoading(true);

    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
      const data: MovieDetails & { Response: string; Error?: string } = await response.json();
      if (data.Response === 'True') {
        setMovie(data);
        let markedFavorite = await isMarkedFavorite(data.imdbID);

        if (markedFavorite) {
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

  const MovieStats = ({ label, value }: { label: string, value: string }) => (
    <View style={{
      alignItems: "center"
    }}>
      <Text style={{ fontSize: 12 }}>{label}</Text>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{value}</Text>
    </View>
  );

  const MovieCast = ({ label, value }: { label: string, value: string }) => (
    <View style={{
      alignItems: "flex-start",
      marginHorizontal: 20,
    }}>
      <Text style={{ fontSize: 12, color: "grey" }}>{label}</Text>
      <Text style={{ fontSize: 14 }}>{value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {movie && (
        <View>
          <ImageBackground
            source={{ uri: movie.Poster }}
            style={[styles.image, { width }]}
          >
            <View style={{ marginHorizontal: 20, marginVertical: 10, alignSelf: "flex-end" }}>
              <TouchableOpacity style={styles.row} onPress={toggleFavorite}>
                <Ionicons name="heart" size={40} color={isFavorite ? "red" : "white"} />
              </TouchableOpacity>
            </View>
            <View style={styles.overlay}>
              <Text style={styles.textTitle}>{movie.Title}</Text>
              <Text style={styles.textSubTitle}>{movie.Year}</Text>
            </View>
          </ImageBackground>
          <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
            <Text style={[styles.textSubTitle, { color: "grey", }]}>{movie.Genre}  •  {movie.Runtime}</Text>
            <Text style={[styles.textTitle, { color: "black", marginTop: 20, }]}>Plot Sumary</Text>
            <Text style={[styles.textSubTitle, { color: "black", marginTop: 10 }]}>{movie.Plot}</Text>
          </View>
          <View style={{
            marginHorizontal: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}>
            <MovieStats label="Score" value={movie.Metascore} />
            <MovieStats label="Rating" value={movie.imdbRating} />
            <MovieStats label="Votes" value={movie.imdbVotes} />
          </View>
          <MovieCast label="Director" value={movie.Director}></MovieCast>
          <MovieCast label="Cast" value={movie.Actors}></MovieCast>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  image: {
    height: 400,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  textTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  textSubTitle: {
    color: "white",
    fontSize: 14,
  },
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