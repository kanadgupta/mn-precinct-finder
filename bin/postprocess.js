// Derived from here: https://github.com/githubocto/flat-demo-xlsx
/** biome-ignore-all lint/suspicious/noConsole: only used as a build step, not in production logs */
// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files

import fs from 'node:fs/promises';

import { readXLSX, xlsx } from 'https://deno.land/x/flat@0.0.15/mod.ts';

// Get the downloaded_filename as the first argument
const inputFilename = Deno.args[0];
const outputFilename = inputFilename.replace('.xlsx', '-processed.json');

// read about what the xlsx library can do here: https://github.com/SheetJS/sheetjs

const workbook = await readXLSX(inputFilename);
const sheetData = workbook.Sheets[workbook.SheetNames[1]];
const precincts = await xlsx.utils.sheet_to_json(sheetData); // can use to_json, to_txt, to_html, to_formulae

// Create an object where the keys are precinct IDs and the values are the precinct objects
const precinctObject = {};

precincts.forEach(precinct => {
  // Handles empty rows or the "End of Worksheet" row
  if (!precinct['County Code']) return;

  const stateCode = '27';
  const fipsCode = `${precinct['County Code'] * 2 - 1}`.padStart(3, '0');

  if (fipsCode.length !== 3) console.error('Invalid length for county code:', precinct);

  const precinctCode = precinct['Precinct Code'];

  if (precinctCode.length !== 4) console.error('Invalid length for precinct code:', precinct);

  const fullPrecinctCode = `${stateCode}${fipsCode}${precinctCode}`;

  if (fullPrecinctCode.length !== 9) console.error('Invalid length for full precinct code:', precinct);

  precinctObject[fullPrecinctCode] = precinct;
});

// write to json
await fs.writeFile(outputFilename, JSON.stringify(precinctObject, null, 2));
