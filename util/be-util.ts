import { CityData } from "./fe-util";
import { checkFileExists, getJsonData, saveDataAsJson } from "./fs.wrapper";

export const saveCityData = async (cityData: CityData) => {
  await saveDataAsJson("CITY_DATA_FILE", cityData);
};

export const getCityData = async (): Promise<CityData[]> => {
  console.log("Checking if file exists");
  const fileExists = await checkFileExists("CITY_DATA_FILE");
  if (!fileExists) {
    console.log("File does not exist, creating blank file");
    await saveDataAsJson("CITY_DATA_FILE", []);
    return [];
  }
  console.log("File exists, getting data");
  const data = await getJsonData("CITY_DATA_FILE");
  if (!data) {
    throw new Error(ErrorMessages.CITY_DATA_FILE_NOT_FOUND);
  }
  return data;
};

export const ErrorMessages = {
  CITY_DATA_FILE_NOT_FOUND: `City data file not found`,
};
