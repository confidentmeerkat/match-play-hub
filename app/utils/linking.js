const config = {
  screens: {
    EditProfile: {
      path: "EditProfile/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
  },
};

const linking = {
  prefixes: ["matchplayhub://", "demo://app"],
  config
};

export default linking;
