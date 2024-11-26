import { App, TFile } from "obsidian";
import { NewPropData } from "./main";

/** Add properties from a Map to a note.
 */
export function addProperties(
  app: App,
  file: TFile,
  props: Map<string, NewPropData>,
  overwrite: boolean
) {
  let propCache = app.metadataCache.getAllPropertyInfos();
  app.fileManager.processFrontMatter(file, (frontmatter) => {
    for (const [key, value] of props) {
      console.log(value);
      if (!frontmatter[key] || overwrite) {
        frontmatter[key] = value.data;
        continue;
      }

      //Compare types to see if they can be appended.
      let type1 = value.type;
      let type2 = propCache[key.toLowerCase()].type;

      if (canBeAppended(type1, type2)) {
        if (frontmatter[key] === value.data) continue; //Leave identical values alone.
        if(!value.data) continue; //Do not merge empty values.

        let arr = mergeIntoArrays(frontmatter[key], value.data);
        frontmatter[key] = arr;
        continue;
      } else {
        frontmatter[key] = value.data;
        continue;
      }
    }
  });
}

/** Iterate through all props in a list and add them to an existing set. */
export async function addPropToSet(app: App, set: Set<string>, file: TFile) {
  await app.fileManager.processFrontMatter(file, (frontmatter) => {
    for (const key in frontmatter) {
      console.log({key})
      set.add(key);
    }
  });
  return set;
}

/** Remove properties from a note. */
export function removeProperties(app: App, file: TFile, props: string[]) {
  app.fileManager.processFrontMatter(file, (frontmatter) => {
    for (const prop of props) {
      //delete frontmatter[prop];
      frontmatter[prop] = undefined; //"Hacky" workaround, commented code will work in later version."
    }
  });
}

/** Check if two types can be appended to each other. */
function canBeAppended(str1: string, str2: string) {
  let arr = ["number", "date", "datetime", "checkbox"]; //These values should not be appended.
  if (arr.includes(str1) || arr.includes(str2)) return false;
  return true;
}

/** Convert strings and arrays into single array. */
function mergeIntoArrays(...args: (string | string[])[]): string[] {
  const arrays = args.map((arg) => (Array.isArray(arg) ? arg : [arg]));

  // Flatten the array
  const flattened = arrays.flat();

  // Remove duplicates using Set and spread it into an array
  const unique = [...new Set(flattened)];

  return unique;
}
