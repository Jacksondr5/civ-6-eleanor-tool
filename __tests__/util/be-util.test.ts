import { ErrorMessages, getCityData, saveCityData } from "../../util/be-util";
import { CityData, DEFAULT_GREAT_WORK_COUNTER } from "../../util/fe-util";
import {
  checkFileExists,
  getJsonData,
  saveDataAsJson,
} from "../../util/fs.wrapper";

jest.mock("../../util/fs.wrapper");

describe("be-util", () => {
  describe("saveCityData", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (saveDataAsJson as jest.Mock).mockResolvedValue(undefined);
    });
    it("should save city data", async () => {
      const cityData: CityData = {
        name: "test",
        citiesWithinNine: ["test"],
        greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
        color: "red",
      };
      await saveCityData(cityData);
      expect(saveDataAsJson).toHaveBeenCalledWith("CITY_DATA_FILE", cityData);
    });
  });
  describe("getCityData", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (checkFileExists as jest.Mock).mockResolvedValue(true);
    });
    it("should get city data", async () => {
      const mockData: CityData[] = [
        {
          name: "test",
          citiesWithinNine: ["test"],
          greatWorkBuildings: DEFAULT_GREAT_WORK_COUNTER,
          color: "red",
        },
      ];
      (getJsonData as jest.Mock).mockResolvedValue(mockData);
      const cityData = await getCityData();
      expect(cityData).toEqual(mockData);
    });
    it("should create blank file city data is not found", async () => {
      (checkFileExists as jest.Mock).mockResolvedValue(false);
      const cityData = await getCityData();
      expect(cityData).toEqual([]);
      expect(saveDataAsJson).toHaveBeenCalledWith("CITY_DATA_FILE", []);
    });
  });
});
