export default {
  list: {
    "-1": { $type: "ref", value: ["list", 1] },
    "0": { $type: "ref", value: ["videosById", 22] },
    "1": { $type: "ref", value: ["videosById", 44] },
    length: 2
  },
  videosById: {
    "22": {
      name: "Die Hard",
      rating: 5,
      bookmark: { $type: "atom", value: 73973 }
    },
    "44": {
      name: "Get Out",
      rating: 5,
      bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" }
    }
  },
  supportedLanguages: { $type: "atom", value: ["fr", "en"] }
};
