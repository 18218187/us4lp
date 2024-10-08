import OneSignalError from "./OneSignalError";
export default class TimeoutError extends OneSignalError {
  constructor(message = "The asynchronous operation has timed out.") {
    super(message);
    this.message = message;
    /**
     * Important! Required to make sure the correct error type is detected during instanceof checks.
     * Same applies to all derived classes.
     * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
//# sourceMappingURL=TimeoutError.js.map
