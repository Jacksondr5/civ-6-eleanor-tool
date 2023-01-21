import { CountingError } from "./errors";
import { getJsonData, saveDataAsJson } from "./fs.wrapper";

export type CityData = {
  name: string;
  citiesWithinNine: string[];
  greatWorkBuildings: GreatWorkCounter;
  color: "red" | "green" | "orange";
};

export type GreatWorkBuildingType =
  | "monument"
  | "amphitheater"
  | "cathedral"
  | "artMuseam"
  | "artifactMuseam"
  | "broadcastCenter"
  | "wonder"
  | "palace";

export type GreatWorkCounter = Record<GreatWorkBuildingType, number>;

export const DEFAULT_GREAT_WORK_COUNTER: GreatWorkCounter = {
  monument: -1,
  amphitheater: -1,
  cathedral: -1,
  artMuseam: -1,
  artifactMuseam: -1,
  broadcastCenter: -1,
  wonder: -1,
  palace: -1,
};

export type GreatWorkBuilding = {
  type: GreatWorkBuildingType;
  occupants: number;
};

export const getMaxOccupants = (type: GreatWorkBuildingType) => {
  switch (type) {
    case "monument":
      return 1;
    case "amphitheater":
      return 2;
    case "cathedral":
      return 1;
    case "artMuseam":
      return 3;
    case "artifactMuseam":
      return 3;
    case "broadcastCenter":
      return 1;
    case "wonder":
      return 100;
    case "palace":
      return 1;
  }
};

export const envVars = ["CITY_DATA_FILE"] as const;
export type EnvVars = typeof envVars[number];

export const getEnvVar = (key: EnvVars) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const addCity = (
  existingCities: CityData[],
  cityName: string
): CityData[] => {
  if (existingCities.find((c) => c.name === cityName)) {
    throw new Error(ErrorMessages.CITY_ALREADY_EXISTS(cityName));
  }
  const updatedCities = existingCities.map((c) => {
    return {
      ...c,
      citiesWithinNine: c.citiesWithinNine.filter((c) => c !== cityName),
    };
  });
  return calculateHighlightColors(
    updatedCities.concat({
      name: cityName,
      citiesWithinNine: [],
      greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
      color: "red",
    })
  );
};

export const removeCity = (
  existingCities: CityData[],
  cityName: string
): CityData[] => {
  if (!existingCities.find((c) => c.name === cityName)) {
    throw new Error(ErrorMessages.CITY_NOT_FOUND(cityName));
  }
  return calculateHighlightColors(
    existingCities.filter((c) => c.name !== cityName)
  );
};

export const updateGreatWorks = (
  existingCities: CityData[],
  cityName: string,
  buildingType: GreatWorkBuildingType,
  newCount: number
): CityData[] => {
  if (newCount > getMaxOccupants(buildingType)) {
    throw new CountingError(
      ErrorMessages.COUNT_TOO_HIGH(newCount, buildingType)
    );
  }
  const city = existingCities.find((c) => c.name === cityName);
  if (!city) {
    throw new Error(ErrorMessages.CITY_NOT_FOUND(cityName));
  }
  city.greatWorkBuildings = {
    ...city.greatWorkBuildings,
    [buildingType]: newCount,
  };
  return existingCities.map((c) => {
    if (c.name === cityName) {
      return city;
    }
    return c;
  });
};

export const calculateHighlightColors = (cities: CityData[]): CityData[] => {
  const totalCitiesWithinNine = cities.reduce(
    (acc, city) => acc + city.citiesWithinNine.length,
    0
  );
  const averageCitiesWithinNine = totalCitiesWithinNine / cities.length;
  return cities.map((city) => {
    if (city.citiesWithinNine.length === 0) {
      return { ...city, color: "red" };
    }
    const color =
      city.citiesWithinNine.length >= averageCitiesWithinNine
        ? "green"
        : "orange";
    return { ...city, color };
  });
};

export const updateCitiesWithinNine = (
  existingCities: CityData[],
  cityName: string,
  newCitiesWithinNine: string[]
): CityData[] => {
  const city = existingCities.find((c) => c.name === cityName);
  if (!city) {
    throw new Error(ErrorMessages.CITY_NOT_FOUND(cityName));
  }
  city.citiesWithinNine = newCitiesWithinNine;
  return calculateHighlightColors(existingCities);
};

export const ErrorMessages = {
  COUNT_TOO_HIGH: (count: number, type: GreatWorkBuildingType) =>
    `Count too high for ${type}: ${count}`,
  BUILDING_TYPE_NOT_FOUND: (type: GreatWorkBuildingType) =>
    `Building type not found: ${type}`,
  CITY_NOT_FOUND: (name: string) => `City not found: ${name}`,
  BUILDING_ALREADY_EXISTS: (type: GreatWorkBuildingType) =>
    `Building already exists: ${type}`,
  CITY_ALREADY_EXISTS: (name: string) => `City already exists: ${name}`,
};
