import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "movie-app-challenge",
  slug: "movie-app-challenge",
  version: "1.0.0",
  extra: {
    omdbApiKey: process.env.OMDB_API_KEY,
  },
});