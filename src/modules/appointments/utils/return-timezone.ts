import moment from 'moment-timezone';

export function verifyTimeZone(country: string, state: string, city: string) {
  if (country === 'Portugal' && state === 'Açores') {
    const azoresTime = moment()
      .tz('Atlantic/Azores')
      .format('YYYY-MM-DD HH:mm:ss');
    return azoresTime;
  }
  if (country === 'Portugal' && state !== 'Açores') {
    const lisbonTime = moment()
      .tz('Europe/Lisbon')
      .format('YYYY-MM-DD HH:mm:ss');
    return lisbonTime;
  }
  if (
    country === 'Brasil' &&
    (state.toLocaleLowerCase() === 'am' ||
      state.toLocaleLowerCase() === 'ms' ||
      state.toLocaleLowerCase() === 'mt' ||
      state.toLocaleLowerCase() === 'ro')
  ) {
    const manausTime = moment()
      .tz('America/Manaus')
      .format('YYYY-MM-DD HH:mm:ss');
    return manausTime;
  }
  if (country === 'Brasil' && state.toLocaleLowerCase() === 'ac') {
    const rioBrancoTime = moment()
      .tz('America/Rio_Branco')
      .format('YYYY-MM-DD HH:mm:ss');
    return rioBrancoTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'ny') {
    const newYorkTime = moment()
      .tz('America/New_York')
      .format('YYYY-MM-DD HH:mm:ss');
    return newYorkTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'il') {
    const chicagoTime = moment()
      .tz('America/Chicago')
      .format('YYYY-MM-DD HH:mm:ss');
    return chicagoTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'co') {
    const denverTime = moment()
      .tz('America/Denver')
      .format('YYYY-MM-DD HH:mm:ss');
    return denverTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'ca') {
    const losAngelesTime = moment()
      .tz('America/Los_Angeles')
      .format('YYYY-MM-DD HH:mm:ss');
    return losAngelesTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'ak') {
    const anchorageTime = moment()
      .tz('America/Anchorage')
      .format('YYYY-MM-DD HH:mm:ss');
    return anchorageTime;
  }
  if (country === 'Estados Unidos' && state.toLocaleLowerCase() === 'hi') {
    const acreTime = moment()
      .tz('Pacific/Honolulu')
      .format('YYYY-MM-DD HH:mm:ss');
    return acreTime;
  }
  if (
    country === 'Estados Unidos' &&
    state.toLocaleLowerCase() === 'tx' &&
    (city.toLocaleLowerCase() === 'houston' ||
      city.toLocaleLowerCase() === 'dallas' ||
      city.toLocaleLowerCase() === 'austin' ||
      city.toLocaleLowerCase() === 'san Antonio')
  ) {
    const chicagoTime = moment()
      .tz('America/Chicago')
      .format('YYYY-MM-DD HH:mm:ss');
    return chicagoTime;
  }

  return false;
}
