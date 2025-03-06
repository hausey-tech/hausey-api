const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

type TimeZoneMap = {
  [country: string]: {
    [state: string]: string | { [city: string]: string; default: string };
    default: string;
  };
};

export function verifyTimeZone(
  country?: string,
  state?: string,
  city?: string,
): string | null {
  if (!country || !state || !city) {
    console.log(
      `Dados incompletos para fuso horário: País ${country} - Estado ${state} - Cidade ${city}`,
    );
    return null;
  }

  const lowerCountry = country.toLowerCase();
  const lowerState = state.toLowerCase();
  const lowerCity = city.toLowerCase();

  const timeZoneMap: TimeZoneMap = {
    portugal: {
      aco: 'Atlantic/Azores',
      default: 'Europe/Lisbon',
    },
    brasil: {
      am: 'America/Manaus',
      ac: 'America/Rio_Branco',
      ms: 'America/Campo_Grande',
      mt: 'America/Cuiaba',
      ro: 'America/Porto_Velho',
      default: 'America/Sao_Paulo',
    },
    'estados unidos': {
      ny: 'America/New_York',
      il: 'America/Chicago',
      co: 'America/Denver',
      ca: 'America/Los_Angeles',
      ak: 'America/Anchorage',
      hi: 'Pacific/Honolulu',
      tx: {
        houston: 'America/Chicago',
        dallas: 'America/Chicago',
        austin: 'America/Chicago',
        'san antonio': 'America/Chicago',
        default: 'America/Chicago',
      },
      default: 'America/New_York',
    },
  };

  if (lowerCountry === 'estados unidos' && lowerState === 'tx') {
    const texasTimeZones = timeZoneMap[lowerCountry][lowerState];
    if (typeof texasTimeZones === 'object') {
      return texasTimeZones[lowerCity] || texasTimeZones.default;
    }
    return 'America/Chicago';
  }

  const countryTimeZones = timeZoneMap[lowerCountry];
  if (countryTimeZones) {
    const stateTimeZone = countryTimeZones[lowerState];
    if (typeof stateTimeZone === 'string') {
      return stateTimeZone;
    }
    return countryTimeZones.default;
  }

  return DEFAULT_TIMEZONE;
}
