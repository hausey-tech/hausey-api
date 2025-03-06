import moment from 'moment-timezone';

type TimeZoneMap = {
  [country: string]: {
    [state: string]: string | { [city: string]: string; default: string };
    default: string;
  };
};

const DEFAULT_TIMEZONE = 'America/New_York';

export function verifyTimeZone(
  country?: string,
  state?: string,
  city?: string,
): string | null {
  if (!country || !state || !city) {
    console.log(
      `Dados incompletos para fuso horário: País ${country} - Estado ${state} - Cidade ${city}`,
    );
    return null; // Apenas retorna null sem lançar erro
  }

  const lowerCountry = country.toLowerCase();
  const lowerState = state.toLowerCase();
  const lowerCity = city.toLowerCase();

  const timeZoneMap: TimeZoneMap = {
    portugal: {
      açores: 'Atlantic/Azores',
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

  let timeZone: string;

  if (lowerCountry === 'estados unidos' && lowerState === 'tx') {
    const texasTimeZones = timeZoneMap[lowerCountry][lowerState];
    if (typeof texasTimeZones === 'object') {
      timeZone = texasTimeZones[lowerCity] || texasTimeZones.default;
    } else {
      timeZone = 'America/Chicago';
    }
  } else {
    const countryTimeZones = timeZoneMap[lowerCountry];
    if (countryTimeZones) {
      const stateTimeZone = countryTimeZones[lowerState];
      if (typeof stateTimeZone === 'string') {
        timeZone = stateTimeZone;
      } else {
        timeZone = countryTimeZones.default;
      }
    } else {
      timeZone = DEFAULT_TIMEZONE;
    }
  }

  return moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
}
