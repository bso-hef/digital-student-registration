/**
 * Removes extension from file.
 * @param file - Filename as a string.
 * @returns The filename without its extension.
 */
export const removeExtensionFromFile = file => {
  if (typeof file !== "string") {
    throw new TypeError("Expected a string as the file name");
  }

  if (!file.includes(".")) {
    return file;
  }

  return file.split(".").slice(0, -1).join(".");
};

export const getRouteNameFromFile = file => {
  if (typeof file !== "string") {
    throw new TypeError("Expected a string as the file name");
  }

  return file.replace(/\.route\.js$/, "");
};
