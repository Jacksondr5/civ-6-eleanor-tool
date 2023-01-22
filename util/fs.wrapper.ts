import { promises as fs } from "fs";
import { EnvVars, getEnvVar } from "./fe-util";

export const saveDataAsJson = (fileEnvVar: EnvVars, data: any) =>
  fs.writeFile(getEnvVar(fileEnvVar), data);

export const getJsonData = async (fileEnvVar: EnvVars): Promise<any> => {
  const data = await fs.readFile(getEnvVar(fileEnvVar));
  return JSON.parse(data.toString());
};

export const checkFileExists = async (
  fileEnvVar: EnvVars
): Promise<boolean> => {
  try {
    await fs.access(getEnvVar(fileEnvVar));
    return true;
  } catch (e) {
    return false;
  }
};
