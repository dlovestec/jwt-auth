export default class AppError extends Error {
  statusCode: number;

  constructor({
    message,
    statusCode,
    name,
  }: {
    message: string;
    statusCode: number;
    name?: string;
  }) {
    super(message);
    this.name = name ?? "AppError";
    this.statusCode = statusCode;
  }
}
