export class CountingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CountingError";
  }
}
