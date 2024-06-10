export class TimeSpan {
  constructor(private _milliseconds: number) {}

  public toMilliseconds() {
    return this._milliseconds;
  }

  public toSeconds() {
    return this._milliseconds / 1000;
  }

  public toMinutes() {
    return this.toSeconds() / 60;
  }

  public toHours() {
    return this.toMinutes() / 60;
  }

  public toDays() {
    return this.toHours() / 24;
  }

  public add(timeSpan: TimeSpan) {
    return new TimeSpan(this._milliseconds + timeSpan._milliseconds);
  }

  public subtract(timeSpan: TimeSpan) {
    return new TimeSpan(this._milliseconds - timeSpan._milliseconds);
  }

  public addTo(date: Date) {
    return new Date(date.getTime() + this._milliseconds);
  }

  public subtractFrom(date: Date) {
    return new Date(date.getTime() - this._milliseconds);
  }

  public static fromMilliseconds(milliseconds: number) {
    return new TimeSpan(milliseconds);
  }

  public static fromSeconds(seconds: number) {
    return new TimeSpan(seconds * 1000);
  }

  public static fromMinutes(minutes: number) {
    return new TimeSpan(minutes * 1000 * 60);
  }

  public static fromHours(hours: number) {
    return new TimeSpan(hours * 1000 * 60 * 60);
  }

  public static fromDays(days: number) {
    return new TimeSpan(days * 1000 * 60 * 60 * 24);
  }
}