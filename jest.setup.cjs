/* global jest */

const React = require("react");
const { Text } = require("react-native");

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const MockIcon = ({ name, testID }) =>
  React.createElement(Text, { testID, accessibilityLabel: name }, name);

// Keep Expo icon font loading from scheduling async state updates in Jest.
jest.mock("@expo/vector-icons", () => {
  const iconExports = [
    "AntDesign",
    "Entypo",
    "EvilIcons",
    "Feather",
    "FontAwesome",
    "FontAwesome5",
    "FontAwesome6",
    "Fontisto",
    "Foundation",
    "Ionicons",
    "MaterialCommunityIcons",
    "MaterialIcons",
    "Octicons",
    "SimpleLineIcons",
    "Zocial",
  ].reduce(
    (exports, iconName) => ({
      ...exports,
      [iconName]: MockIcon,
    }),
    {},
  );

  return {
    ...iconExports,
    createIconSet: () => MockIcon,
    createIconSetFromFontello: () => MockIcon,
    createIconSetFromIcoMoon: () => MockIcon,
  };
});

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => ({
  __esModule: true,
  default: MockIcon,
}));

jest.mock(
  "@react-native-vector-icons/material-design-icons",
  () => ({
    __esModule: true,
    default: MockIcon,
  }),
  { virtual: true },
);

jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => ({
  __esModule: true,
  default: MockIcon,
}));
