import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    height: 30,
    backgroundColor: "#dbdbdb",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontSize: 10,
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.66)",
    width: "100%",
    alignItems: "flex-start",

    padding: 5,
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    justifyContent: "flex-end"
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  verticalSpacingSmall: {
    marginVertical: 8,
  },
  verticalSpacingMedium: {
    marginVertical: 16,
  },
  verticalSpacingLarge: {
    marginVertical: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,

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
  detailsContainer: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
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
  detailsImage: {
    aspectRatio: 9/16,
    justifyContent: "flex-end",
  },
    detailsOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  item: {
    flex: 1,
    margin: 5,
    aspectRatio: 9 / 16,
    backgroundColor: "rgba(39, 39, 39, 0.8)",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
  },
  poster: {
    width: 90,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  posterRow: {
    width: 40,
    height: 60,
    borderRadius: 6,
  },
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

export default styles;