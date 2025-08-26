
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { addFavorite, initDb, isMarkedFavorite, removeFavorite } from '../_database';
import MovieDetails from "../models/movieDetails";
const { width } = Dimensions.get("window");

import { onRequestDetails } from "../apiClient";
import styles from "../styles";

export default function DetailsScreen() {
  const { movieId } = useLocalSearchParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchMoviesDetails = async (id: string) => {
    setLoading(true);
    let requestData = await onRequestDetails(id);

    if(requestData){
      setMovie(requestData);
      let markedFavorite = await isMarkedFavorite(requestData.imdbID);
      if (markedFavorite) {
          setIsFavorite(true);
        }
    }

    setLoading(false);
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
      flex: 1,
      margin: 10,
      alignItems: "center",
      padding: 5,
      borderRadius: 8,
      backgroundColor: "#e3e3e3"
    }}>
      <Text style={{ fontSize: 12 }}>{label}</Text>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{value}</Text>
    </View>
  );

  const MovieCast = ({ label, value }: { label: string, value: string }) => (
    <View style={{
      alignItems: "flex-start",
      marginHorizontal: 20,
      marginBottom: 8
    }}>
      <Text style={{ fontSize: 12, color: "grey" }}>{label}</Text>
      <Text style={{ fontSize: 14 }}>{value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.detailsContainer}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{alignSelf: "center"}}/>}

      {movie && (
        <View>
          <ImageBackground
            source={{ uri: movie.Poster }}
            style={[styles.detailsImage, { width }]}
          >
            <View style={{ marginHorizontal: 20, marginVertical: 10, alignSelf: "flex-end" }}>
              <TouchableOpacity style={styles.row} onPress={toggleFavorite}>
                <Ionicons name="heart" size={40} color={isFavorite ? "red" : "white"} />
              </TouchableOpacity>
            </View>
            <View style={styles.detailsOverlay}>
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
            marginHorizontal: 20,
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
          <MovieCast label="Writer" value={movie.Writer}></MovieCast>
          <MovieCast label="Actors" value={movie.Actors}></MovieCast>
        
        </View>
      )}
    </ScrollView>
  );
}