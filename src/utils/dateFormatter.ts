import moment from "moment-jalaali";
import { DateTime } from "luxon";

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

interface DateFormatOptions {
  showTime?: boolean;
  showYear?: boolean;
  showDay?: boolean;
  timezone?: string;
}

export function formatDate(
  date: string | Date,
  locale: string | undefined,
  options: DateFormatOptions = {}
) {
  const {
    showTime = false,
    showYear = true,
    showDay = true,
    timezone,
  } = options;

  if (locale === "fa") {
    // Persian calendar
    const jDate = moment(date);

    let result = "";

    if (showDay) {
      result += jDate.jDate();
    }

    if (showDay && (showYear || persianMonths[jDate.jMonth()])) {
      result += " ";
    }

    result += persianMonths[jDate.jMonth()];

    if (showYear) {
      result += ` ${jDate.jYear()}`;
    }

    if (showTime) {
      const time = DateTime.fromJSDate(new Date(date))
        .setZone(timezone || "Asia/Tehran")
        .toFormat("HH:mm");
      result += ` | ${time}`;
    }

    return result;
  } else {
    // Gregorian calendar
    const datetime = DateTime.fromJSDate(new Date(date)).setZone(
      timezone || "UTC"
    );

    let format = "";

    if (showDay) format += "d ";
    format += "MMM";
    if (showYear) format += ", yyyy";
    if (showTime) format += " | HH:mm";

    return datetime.toFormat(format);
  }
}

export function getYear(
  date: string | Date,
  locale: string | undefined
): string {
  if (locale === "fa") {
    return moment(date).jYear().toString();
  } else {
    return new Date(date).getFullYear().toString();
  }
}

export function getMonthName(
  date: string | Date,
  locale: string | undefined
): string {
  if (locale === "fa") {
    const jDate = moment(date);
    return persianMonths[jDate.jMonth()];
  } else {
    return DateTime.fromJSDate(new Date(date)).toFormat("MMM");
  }
}
