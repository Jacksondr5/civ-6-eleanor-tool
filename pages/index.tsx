import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import {
  addCity,
  CityData,
  GreatWorkBuildingType,
  removeCity,
  updateCitiesWithinNine,
  updateGreatWorks,
} from "../util/fe-util";
import { getCityData } from "../util/be-util";
import {
  AppBar,
  Toolbar,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import ButtonGroup from "../comps/ButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { CountingError } from "../util/errors";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: { data: CityData[] }) {
  const [cities, setCities] = useState(props.data);
  const [newCityName, setNewCityName] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(cities),
    });
  }, [cities]);
  const knownCities = _.uniq(cities.map((c) => c.citiesWithinNine).flat());
  const onCounterChange = (
    action: (
      existingCities: CityData[],
      cityName: string,
      buildingType: GreatWorkBuildingType,
      newCount: number
    ) => CityData[]
  ) => {
    try {
      const newCities = action(cities, newCityName, "monument", 1);
      setCities(newCities);
    } catch (e) {
      if (e instanceof CountingError) {
        return;
      }
      if (e instanceof Error) {
        setError(e.message);
        return;
      }
      throw e;
    }
  };
  const convertColorToClassName = (city: CityData) => {
    switch (city.color) {
      case "red":
        return styles["low-value"];
      case "orange":
        return styles["medium-value"];
      case "green":
        return styles["high-value"];
      default:
        throw new Error("Unknown color");
    }
  };
  return (
    <>
      <Head>
        <title>Eleanor Great Work Manager</title>
        <meta
          name="description"
          content="A tool to help you manage great works as Eleanor in Civ 6"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Eleanor Great Work Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        {error.length > 0 && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            className={styles.alert}
          >
            {error}
          </Alert>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>City</TableCell>
                <TableCell align="center">Cities Within 9 Tiles</TableCell>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Monument</TableCell>
                <TableCell align="center">Amphitheater</TableCell>
                <TableCell align="center">Cathedral</TableCell>
                <TableCell align="center">Art Museam</TableCell>
                <TableCell align="center">Artifact Museam</TableCell>
                <TableCell align="center">Broadcast Center</TableCell>
                <TableCell align="center">Wonder</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.map((city) => (
                <TableRow
                  key={city.name}
                  className={convertColorToClassName(city)}
                >
                  <TableCell component="th" scope="row">
                    {city.name}
                  </TableCell>
                  <TableCell align="center">
                    <Autocomplete
                      freeSolo
                      multiple
                      id="tags-standard"
                      options={knownCities}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Nearby Cities"
                          placeholder="Enter City"
                        />
                      )}
                      value={city.citiesWithinNine}
                      onChange={(event, newValue) => {
                        setCities(
                          updateCitiesWithinNine(cities, city.name, newValue)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{city.citiesWithinNine.length}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.monument}
                      onCounterChange={(counter) =>
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "monument",
                            counter
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.amphitheater}
                      onCounterChange={(counter) => {
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "amphitheater",
                            counter
                          )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.cathedral}
                      onCounterChange={(counter) =>
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "cathedral",
                            counter
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.artMuseam}
                      onCounterChange={(counter) => {
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "artMuseam",
                            counter
                          )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.artifactMuseam}
                      onCounterChange={(counter) =>
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "artifactMuseam",
                            counter
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.broadcastCenter}
                      onCounterChange={(counter) =>
                        onCounterChange(() =>
                          updateGreatWorks(
                            cities,
                            city.name,
                            "broadcastCenter",
                            counter
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.wonder}
                      onCounterChange={(counter) =>
                        onCounterChange(() =>
                          updateGreatWorks(cities, city.name, "wonder", counter)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        try {
                          const newCities = removeCity(cities, city.name);
                          setCities(newCities);
                        } catch (e) {
                          if (e instanceof Error) {
                            setError(e.message);
                            return;
                          } else {
                            throw e;
                          }
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TextField
            placeholder="City Name"
            variant="outlined"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              try {
                setCities(addCity(cities, newCityName));
                setNewCityName("");
              } catch (e) {
                if (e instanceof Error) {
                  setError(e.message);
                  return;
                } else {
                  throw e;
                }
              }
            }}
          >
            Add City
          </Button>
        </TableContainer>
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const data = await getCityData();
  return {
    props: {
      data,
    },
  };
};
