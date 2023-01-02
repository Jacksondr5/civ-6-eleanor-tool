import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import {
  addCity,
  CityData,
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
} from "@mui/material";
import ButtonGroup from "../comps/ButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import _ from "lodash";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: { data: CityData[] }) {
  const [cities, setCities] = useState(props.data);
  const [newCityName, setNewCityName] = useState("");
  useEffect(() => {
    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(cities),
    });
  }, [cities]);
  const knownCities = _.uniq(cities.map((c) => c.citiesWithinNine).flat());
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
                <TableRow key={city.name}>
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
                        setCities(
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
                        const newdata = updateGreatWorks(
                          cities,
                          city.name,
                          "amphitheater",
                          counter
                        );
                        console.log(newdata);
                        setCities(newdata);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.cathedral}
                      onCounterChange={(counter) =>
                        setCities(
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
                        const newdata = updateGreatWorks(
                          cities,
                          city.name,
                          "artMuseam",
                          counter
                        );
                        console.log(newdata);
                        setCities(newdata);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      count={city.greatWorkBuildings.artifactMuseam}
                      onCounterChange={(counter) =>
                        setCities(
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
                        setCities(
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
                        setCities(
                          updateGreatWorks(cities, city.name, "wonder", counter)
                        )
                      }
                    />
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
              setCities(addCity(cities, newCityName));
              setNewCityName("");
            }}
          >
            Add City
          </Button>
        </TableContainer>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getCityData();
  return {
    props: {
      data,
    },
  };
};
