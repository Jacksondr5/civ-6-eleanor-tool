import {
  addCity,
  calculateHighlightColors,
  CityData,
  DEFAULT_GREAT_WORK_COUNTER,
  ErrorMessages,
  getEnvVar,
  getMaxOccupants,
  updateCitiesWithinNine,
  updateGreatWorks,
} from "../../util/fe-util";

describe("fe-util", () => {
  describe("getMaxOccupants", () => {
    it("should get correct max occupants for each building type", () => {
      expect(getMaxOccupants("monument")).toBe(1);
      expect(getMaxOccupants("amphitheater")).toBe(2);
      expect(getMaxOccupants("artMuseam")).toBe(3);
      expect(getMaxOccupants("artifactMuseam")).toBe(3);
      expect(getMaxOccupants("broadcastCenter")).toBe(1);
      expect(getMaxOccupants("wonder")).toBe(-1);
      expect(getMaxOccupants("palace")).toBe(1);
    });
  });

  describe("getEnvVar", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      delete process.env.TEST;
    });
    it("should throw error if environment variable is missing", () => {
      expect(() => getEnvVar("CITY_DATA_FILE")).toThrowError(
        "Missing environment variable: CITY_DATA_FILE"
      );
    });
    it("should return environment variable if it exists", () => {
      process.env.CITY_DATA_FILE = "test";
      expect(getEnvVar("CITY_DATA_FILE")).toBe("test");
    });
  });
  describe("addCity", () => {
    it("should add the new city to the given list", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      const updatedCities = addCity(existingCities, "test2");
      expect(updatedCities).toHaveLength(2);
      expect(updatedCities[1].name).toBe("test2");
    });
    it("should remove the new city from cities within nine", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: ["test2"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      const updatedCities = addCity(existingCities, "test2");
      expect(updatedCities[0].citiesWithinNine).toHaveLength(0);
    });
    it("should update colors", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: ["test3"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      const updatedCities = addCity(existingCities, "test2");
      expect(updatedCities[0].color).toBe("green");
      expect(updatedCities[1].color).toBe("red");
    });
    it("should throw if the city already exists", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      expect(() => addCity(existingCities, "test")).toThrowError(
        ErrorMessages.CITY_ALREADY_EXISTS("test")
      );
    });
  });
  describe("updateGreatWorks", () => {
    it("should update the great works for the given city", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: {
            ...DEFAULT_GREAT_WORK_COUNTER,
            artMuseam: 1,
          },
          color: "red",
        },
      ];
      const updatedCities = updateGreatWorks(
        existingCities,
        "test",
        "artMuseam",
        2
      );
      expect(updatedCities[0].greatWorkBuildings.artMuseam).toBe(2);
    });
    it("should throw if the new count is greater than max occupants", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: {
            ...DEFAULT_GREAT_WORK_COUNTER,
            artMuseam: 1,
          },
          color: "red",
        },
      ];
      expect(() =>
        updateGreatWorks(existingCities, "test", "artMuseam", 4)
      ).toThrowError(ErrorMessages.COUNT_TOO_HIGH(4, "artMuseam"));
    });
    it("should throw if city does not exist", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: {
            ...DEFAULT_GREAT_WORK_COUNTER,
            artMuseam: 1,
          },
          color: "red",
        },
      ];
      expect(() =>
        updateGreatWorks(existingCities, "test2", "artMuseam", 2)
      ).toThrowError(ErrorMessages.CITY_NOT_FOUND("test2"));
    });
  });
  describe("calculateHighlightColors", () => {
    it("should highlight cities with none within nine as red", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "green",
        },
      ];
      const updatedCities = calculateHighlightColors(existingCities);
      expect(updatedCities[0].color).toBe("red");
    });
    it("should highlight cities with less than average within nine as orange", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: ["test"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "green",
        },
        {
          name: "test2",
          citiesWithinNine: ["test", "test", "test"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "green",
        },
      ];
      const updatedCities = calculateHighlightColors(existingCities);
      expect(updatedCities[0].color).toBe("orange");
    });
    it("should highlight cities with more than average within nine as green", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: ["test", "test", "test"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "orange",
        },
        {
          name: "test2",
          citiesWithinNine: ["test"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "orange",
        },
      ];
      const updatedCities = calculateHighlightColors(existingCities);
      expect(updatedCities[0].color).toBe("green");
    });
  });
  describe("updateCitiesWithinNine", () => {
    it("should update the cities within nine for the given city", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      const updatedCities = updateCitiesWithinNine(existingCities, "test", [
        "test2",
      ]);
      expect(updatedCities[0].citiesWithinNine).toEqual(["test2"]);
    });
    it("should update colors", () => {
      const existingCities: CityData[] = [
        {
          name: "test",
          citiesWithinNine: [],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      const updatedCities = updateCitiesWithinNine(existingCities, "test", [
        "test2",
      ]);
      expect(updatedCities[0].color).toBe("green");
    });
    it("should throw if city does not exist", () => {
      const existingCities: CityData[] = [];
      expect(() =>
        updateCitiesWithinNine(existingCities, "test2", ["test"])
      ).toThrowError(ErrorMessages.CITY_NOT_FOUND("test2"));
    });
  });
});
