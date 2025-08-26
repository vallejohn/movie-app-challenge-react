import { Link } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, View, } from "react-native";
import { Dropdown } from "react-native-element-dropdown";


const API_KEY = "b9bd48a6";
const SEARCH_TERM = "batman";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

interface OmdbResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
}


export default function HomeScreen() {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(50), (val, index) => ({
      label: (currentYear - index).toString(),
      value: currentYear - index,
    }));

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("batman");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedYear, setYear] = useState(null);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState("ASC");
  const [sortType, setSortType] = useState("Title");
  

  const fetchMovies = (query: string, year: any, pageNumber: number) => {
    console.log('fetching movies:::', pageNumber)
    if (!query) return;

    setLoading(true);

    var yearParam = ``;
    if(year != null || year != 0){
      yearParam = `&y=${year}`;
    }
 
    fetch(`http://www.omdbapi.com/?s=${query}${yearParam}&page=${pageNumber}&apikey=${API_KEY}`)
      .then((response) => response.json())
      .then((data: OmdbResponse) => {
        if (data.Response === "True" && data.Search) {
          if(pageNumber == 1){
                      const uniqueMovies = Array.from(
            new Map(data.Search.map((movie) => [movie.imdbID, movie])).values()
          );
            setMovies(uniqueMovies)
          }else{
            console.log('results:::', data.Search.length)
            const newMovies = Array.from(
              new Map(data.Search.map((movie) => [movie.imdbID, movie])).values()
            );

             setMovies(movies => [...movies, ...newMovies])

             console.log("total movies stored: ", movies.length);

          }
          setTotalResults(Number(data.totalResults) || 0);
        } else if (pageNumber === 1) {
          setMovies([]);
          setTotalResults(0)
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if(search.trim().length > 0){
        setPage(1)
        fetchMovies(search, selectedYear, 1);
      }else{
        setMovies([])
      }
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [search]);

  const loadMore = () => {
    console.log('loading more:::');
    console.log('movie length: ', movies.length);
    console.log('total results: ', totalResults);    
    console.log('loading: ', loading); 

    if(movies.length < totalResults && !loading){
      const nextPage = page + 1;
      setPage(nextPage); 
      fetchMovies(search, selectedYear, nextPage)
    }
  };

  const onUpdateYear = (item: any) => {
    console.log("Year is updated", item)
    setYear(item.value)
    setPage(1);
    fetchMovies(search, item.value, 1)
  }

  const onSortList = (method: string, type: string) => {
    setSortType(type);
    setSelectedSortingMethod(method);

    let sortedMovies: Movie[] = [];

    if(type == "Year"){
      if(method == "ASC"){
        sortedMovies = movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
      }else{
        sortedMovies = movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
      }
    }

    if(type == "Title"){
      if(method == "ASC"){
        sortedMovies = movies.sort((a, b) => parseInt(a.Title) - parseInt(b.Title))
      }else{
        sortedMovies = movies.sort((a, b) => parseInt(b.Title) - parseInt(a.Title))
      }
    }

    setMovies(sortedMovies);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movie Database</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search movies..."
        />
    
      </View>
      <View style={styles.filterRow}>
        <Dropdown
          style={{
            height: 50,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            paddingHorizontal: 8,
            flex: 1,
          }}
          data={years}
          labelField="label"
          valueField="value"
          placeholder="Select year"
          value={selectedYear}
          onChange={(item) => {onUpdateYear(item)}}
        />
        <Dropdown
          style={{
            height: 50,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            paddingHorizontal: 8,
            flex: 1,
          }}
          data={["ASC", "DESC"]}
          labelField="label"
          valueField="value"
          placeholder="Sort"
          value={selectedSortingMethod}
          onChange={(item) => {onSortList(item, sortType)}}
        />
        <Dropdown
          style={{
            height: 50,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            paddingHorizontal: 8,
            flex: 1,
          }}
          data={["Year", "Title"]}
          labelField="label"
          valueField="value"
          placeholder="Type"
          value={sortType}
          onChange={(item) => {onSortList(selectedSortingMethod, item)}}
        />
      </View>

      <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <Link href={`/details/${item.imdbID}`}>
                <View style={styles.itemRow}>
                {item.Poster !== "N/A" && (
                  <Image source={{ uri: item.Poster }} style={styles.poster} />
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.Title}</Text>
                  <Text style={styles.year}>{item.Year}</Text>
                </View>
              </View>
              </Link>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading ? <ActivityIndicator size="large"/> : null
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    height: 40,
  },
  year: { fontSize: 14, color: "#666", marginTop: 4 },
  textContainer: { flex: 1, justifyContent: "flex-start" },
  itemRow: {
    flexDirection: "row",
    marginRight: 15,
    marginLeft: 10,
    alignItems: "flex-start",
    backgroundColor: "#f1f1f1",
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
  },
    linkTile: {
    marginBottom: 12,
  },
    filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  item: {
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
    flexShrink: 1,
  },
    poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  posterRow: {
    width: 40,
    height: 60,
    borderRadius: 6,
  },
});