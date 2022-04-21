/* eslint-disable sort-keys */
// We're not sorting keys to keep value ordering.

enum States {
  AL = "Alabama",
  AK = "Alaska",
  AS = "American Samoa",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FM = "Federated States of Micronesia",
  FL = "Florida",
  GA = "Georgia",
  GU = "Guam",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MH = "Marshall Islands",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  MP = "Northern Mariana Islands",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PW = "Palau",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
  VI = "Virgin Islands",
  AA = "Armed Forces Americas",
  AE = "Armed Forces Europe",
  AP = "Armed Forces Pacific",
}

export default States;

export const getState = (value: string) => {
  const sanitized = value.toLowerCase().trim();
  return Object.entries(States).find(([key, value]) => {
    // Match on state code
    if (sanitized === key.toLowerCase()) {
      return true;
    }

    // Match on name
    if (sanitized === value.toLowerCase()) {
      return true;
    }

    // No match
    return false;
  });
};

export const getStateCode = (value: string) => {
  const result = getState(value);
  if (result) {
    return result[0];
  }
};
