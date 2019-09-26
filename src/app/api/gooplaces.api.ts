
// Place Search Set Parameters Func
export const PlaceParameters = (key: string, placeSearch: string, lan: string, inputtype: string ) =>
    `key=${key}&input=${placeSearch}&language=${lan}&inputtype=${inputtype}`;

// Place Details Set Parameters Func
export const getPlaceSearchUrl = (output: string, parameter: string, option?: string) =>
    `https://maps.googleapis.com/maps/api/place/${option}/${output}?${parameter}`;
