import type { FeatureCollection, Geometry, Point } from 'geojson';

import { booleanWithin } from '@turf/boolean-within';
import { point } from '@turf/helpers';

import geojson from './data/mn-precincts.json' with { type: 'json' };
import precinctData from './data/precinct-table-processed.json' with { type: 'json' };

/**
 * The precinct properties that the SOS provides by default
 */
interface PrecinctProps {
  CongDist: string;
  County: string;
  CountyID: string;
  CtyComDist: string;
  MNLegDist: string;
  MNSenDist: string;
  Precinct: string;
  PrecinctID: string;
}

/**
 * The precinct properties that the SOS provides by default
 * and additional properties from the precinct table
 */
export interface ExtendedPrecinctProps extends PrecinctProps {
  Hospital: string;
  Judicial: string;
  MCDCode: string;
  MCDName: string;
  Park: string;
  PrecinctCode: string;
  SoilAndWater: string;
  Ward: string;
}

/**
 * Takes in a geographic coordinate and returns all the metadata
 * for the precinct it's contained in.
 * @param {Object} coordinates Either a GeoJSON point or a longitude/latitude array
 * @returns An object containing all the precinct properties
 * @example findPrecinct([-93.265, 44.9778]);
 * @example findPrecinct({ type: 'Point', coordinates: [-93.265, 44.9778] });
 */
export default function findPrecinct(coordinates: Point | [number, number]): ExtendedPrecinctProps {
  const processedPoint = Array.isArray(coordinates) ? point(coordinates) : coordinates;

  const precinctMatches = (geojson as FeatureCollection<Geometry, PrecinctProps>).features.filter(feat => {
    try {
      return booleanWithin(processedPoint, feat);
    } catch (e) {
      return false;
    }
  });

  if (precinctMatches.length !== 1) throw new Error('Unable to find a precinct match');

  const { properties } = precinctMatches[0];
  const additionalProperties = precinctData[properties.PrecinctID as keyof typeof precinctData];

  // Extracts everything from main GeoJSON file and
  // adds several additional properties from precinct table file
  const everything: ExtendedPrecinctProps = {
    ...properties,
    Hospital: additionalProperties.Hospital,
    Judicial: additionalProperties.Judicial,
    MCDCode: additionalProperties['MCD Code'],
    MCDName: additionalProperties['MCD Name'],
    Park: additionalProperties.Park,
    PrecinctCode: additionalProperties['Precinct Code'],
    SoilAndWater: additionalProperties['Soil and Water'],
    Ward: additionalProperties.Ward,
  };

  return everything;
}
