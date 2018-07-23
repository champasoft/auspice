const path = require("path");
const manifestHelpers = require("./manifestHelpers");

const urlToParts = (url, lower) => {
  if (lower) return url.toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "").split("/");
  return url.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
};


const getSource = (url) => {
  let parts = urlToParts(url, true);
  if (parts[0] === "status") parts = parts.slice(1);
  if (!parts.length) return "live";
  switch (parts[0]) {
    case "local": return "local";
    case "staging": return "staging";
    case "community": return "github";
    default: return undefined;
  }
};

const collectDatasets = (source) => {
  if (source === "local" && global.LOCAL_MANIFEST) {
    return {available: global.LOCAL_MANIFEST, source};
  } else if (source === "live" && global.LIVE_MANIFEST) {
    return {available: global.LIVE_MANIFEST, source};
  }
  return undefined;
};

const constructPathToGet = (source, url, jsonTypeWanted) => {
  const parts = url.replace(/^\//, '').replace(/\/$/, '').split("/");
  const lowerParts = parts.map((p) => p.toLowerCase());
  let pathPrefix, fields, urlPrefix;

  if (lowerParts[0] === "local") {
    pathPrefix = global.LOCAL_DATA_PATH;
    urlPrefix = "local/";
    fields = manifestHelpers.checkFieldsAgainstManifest(lowerParts.slice(1), source);
  } else if (lowerParts[0] === "community") {
    if (parts.length < 3) {
      throw new Error("Community URLs must be of format community/githubOrgName/repoName/...");
    }
    pathPrefix = `https://rawgit.com/${parts[1]}/${parts[2]}/master/auspice/`;
    urlPrefix = `community/${parts[1]}/${parts[2]}/`;
    fields = lowerParts.slice(2);
  } else if (lowerParts[0] === "staging") {
    pathPrefix = global.REMOTE_DATA_STAGING_BASEURL;
    urlPrefix = "";
    fields = manifestHelpers.checkFieldsAgainstManifest(lowerParts.slice(1), source);
  } else {
    /* default is via global.REMOTE_DATA_LIVE_BASEURL (for nextstrain.org, this is the data.nextstrain S3 bucket) */
    pathPrefix = global.REMOTE_DATA_LIVE_BASEURL;
    urlPrefix = "";
    fields = manifestHelpers.checkFieldsAgainstManifest(lowerParts, source);
  }

  let suffix = "";
  if (jsonTypeWanted) {
    suffix += "_" + jsonTypeWanted;
  }
  suffix += ".json";

  return [
    urlPrefix + fields.join("/"),
    path.join(pathPrefix, fields.join("_")+suffix)
  ];
};

const guessTreeName = (parts) => {
  const guesses = ["HA", "NA", "PB1", "PB2", "PA", "NP", "NS", "MP", "L", "S"];
  for (const part of parts) {
    if (guesses.indexOf(part.toUpperCase()) !== -1) return part;
  }
  return undefined;
};

module.exports = {
  getSource,
  constructPathToGet,
  collectDatasets,
  guessTreeName
};
