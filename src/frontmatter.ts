import { TFile } from "obsidian";
import type { NewPropData } from "./main";
import type { PropertyInfos } from "./types/custom";
import type { MultiPropSettings } from "./SettingTab";

type FileProcessor = (
  file: TFile,
  callback: (frontmatter: any) => void
) => Promise<void> | void;

/** Add properties from a Map to a note.
 */
export async function addProperties(
  fileProcessor: FileProcessor,
  file: TFile,
  props: Map<string, NewPropData>,
  alterProp: MultiPropSettings["alterProp"],
  propCache: PropertyInfos
) {
  await fileProcessor(file, (frontmatter) => {
    for (const [key, value] of props) {
      if (alterProp === "ignore" && frontmatter[key]) {
        continue;
      }
      //Tags should always be a List, even if there is just one tag.
      if (
        key === "tags" &&
        !frontmatter.hasOwnProperty("tags") &&
        !Array.isArray(value.data)
      ) {
        frontmatter[key] = [value.data];
        continue;
      }

      if (!frontmatter[key] || alterProp === "overwrite") {
        frontmatter[key] = value.data;
        continue;
      }

      //Compare types to see if they can be appended.
      let type1 = value.type;
      let type2 = propCache[key.toLowerCase()].widget;

      if (canBeAppended(type1, type2)) {
        if (frontmatter[key] === value.data) continue; //Leave identical values alone.
        if (!value.data) continue; //Do not merge empty values.

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
export async function addPropToSet(
  fileProcessor: FileProcessor,
  set: Set<string>,
  file: TFile
) {
  await fileProcessor(file, (frontmatter) => {
    for (const key in frontmatter) {
      set.add(key);
    }
  });
  return set;
}

/** Remove properties from a note. */
export async function removeProperties(
  fileProcessor: FileProcessor,
  file: TFile,
  props: string[]
) {
  await fileProcessor(file, (frontmatter) => {
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
