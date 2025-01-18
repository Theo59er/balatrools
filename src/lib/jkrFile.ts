// Code from https://github.com/WilsontheWolf/balatro-save-loader/

import Pako from "pako";

const returnPrefix = /^return /;
const stringKeys = /\["(.*?)"\]=/g;
const numberKeys = /\[(\d+)\]=/g;
const trailingCommas = /,}/g;

const numberKey = /"NOSTRING_(\d+)":/g
const stringKey = /"([^"]*?)":/g;

function decompress(data: Pako.Data) {
  return Pako.inflateRaw(data, { to: "string" });
}

function compress(data: string) {
  return Pako.deflateRaw(data);
}

function rawToJSON(data: string) {
  return JSON.parse(data
    .replace(returnPrefix, "")
    .replace(stringKeys, "\"$1\":")
    .replace(numberKeys, "\"NOSTRING_$1\":")
    .replace(trailingCommas, "}"));
}

function FixJSONArrays(json: any): any {
  if (typeof json !== 'object' || json === null) {
    return json;
  }
  const keys = Object.keys(json);
  if (keys.length === 0) {
    return json;
  }
  if (!keys.every((key) => key.startsWith('NOSTRING_'))) {
    for (const key of keys) {
      json[key] = FixJSONArrays(json[key]);
    }
    return json;
  }
  const array = [];
  for (const key of keys) {
    // -1 cause lua is 1 indexed
    array[parseInt(key.slice(9)) - 1] = FixJSONArrays(json[key]);
  }
  return array;
}

function FixLuaArrays(json: any) {
  if (Array.isArray(json)) {
    const array = {};
    for (let i = 0; i < json.length; i++) {
      // +1 cause lua is 1 indexed
      //   @ts-ignore
      array[`NOSTRING_${i + 1}`] = FixLuaArrays(json[i]);
    }
    return array;
  }
  if (typeof json === 'object' && json !== null) {
    for (const key in json) {
      json[key] = FixLuaArrays(json[key]);
    }
  }
  return json;

}

function JSONToRaw(data: any) {
  return 'return ' + JSON.stringify(data)
    .replace(numberKey, "[$1]=")
    .replace(stringKey, "[\"$1\"]=");
};

function processFile(buffer: Uint8Array) {
  const data = decompress(buffer);
  const json = rawToJSON(data);
  // localthunk please make your boolean variables consistent :sob:
  if (json.GRAPHICS) json.GRAPHICS.shadows = json.GRAPHICS.shadows === "On";
  return FixJSONArrays(json);
}

function processJSON(json: any) {
  json = FixLuaArrays(json);
  if (json.GRAPHICS) json.GRAPHICS.shadows = json.GRAPHICS.shadows ? "On" : "Off";
  const data = JSONToRaw(json);
  return compress(data);
}

export { decompress, compress, rawToJSON, JSONToRaw, processFile, processJSON, FixJSONArrays, FixLuaArrays };