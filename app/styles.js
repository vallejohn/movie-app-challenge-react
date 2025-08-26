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
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
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
});

export default styles;