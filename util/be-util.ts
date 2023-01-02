import { CityData } from "./fe-util";
import { getJsonData, saveDataAsJson } from "./fs.wrapper";

export const saveCityData = async (cityData: CityData) => {
  await saveDataAsJson("CITY_DATA_FILE", cityData);
};

export const getCityData = async (): Promise<CityData[]> => {
  const data = await getJsonData("CITY_DATA_FILE");
  if (!data) {
    throw new Error(ErrorMessages.CITY_DATA_FILE_NOT_FOUND);
  }
  return data;
};

export const ErrorMessages = {
  CITY_DATA_FILE_NOT_FOUND: `City data file not found`,
};
