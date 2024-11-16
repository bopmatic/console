import { format } from 'date-fns';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

/**
 * Helper function to format dates in the form: "Oct 25, 2024, 2:30 PM"
 * TODO: Add internationalization support based on browser locale
 * @param d
 */
export const bopmaticDateFormat = (d: Date) => {
  return d.toLocaleString('en-US', options);
};

export const bopmaticDateFormat_Grids = (d: Date) => {
  return format(d, 'MMM d, yyyy, h:mm a');
};
