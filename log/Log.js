export default class Log {
  static error(error,method, message = null) {
    const stackLines = error.stack.split("\n");
    const fileLine = stackLines[1];
    const regex = /\((.*):(\d+):(\d+)\)/;
    const match = fileLine.match(regex);
    if (match) {
      const [_, file, line, column] = match;
      console.log({
        error: message || error.message,
        method,
        file,
        line,
        column,
      });
    }
  }
}
