import OneSignalError from "./OneSignalError";
import {
  ApiUsageMetricEvent,
  ApiUsageMetricKind,
} from "../managers/MetricsManager";
export var DeprecatedApiReason;
(function (DeprecatedApiReason) {
  DeprecatedApiReason[(DeprecatedApiReason["HttpPermissionRequest"] = 0)] =
    "HttpPermissionRequest";
  DeprecatedApiReason[(DeprecatedApiReason["SyncHashedEmail"] = 1)] =
    "SyncHashedEmail";
})(DeprecatedApiReason || (DeprecatedApiReason = {}));
export class DeprecatedApiError extends OneSignalError {
  constructor(reason) {
    let errorMessage;
    let kind;
    switch (reason) {
      case DeprecatedApiReason.HttpPermissionRequest:
        errorMessage =
          `The HTTP permission request has been deprecated. Please remove any custom popups from ` +
          `your code.`;
        kind = ApiUsageMetricKind.HttpPermissionRequest;
        break;
      case DeprecatedApiReason.SyncHashedEmail:
        errorMessage =
          "API syncHashedEmail() has been deprecated and will be removed in a future SDK release." +
          " Please remove any usages from your code.";
        kind = ApiUsageMetricKind.SyncHashedEmail;
        break;
    }
    super(errorMessage);
    this.reportUsage(kind);
    /**
     * Important! Required to make sure the correct error type is detected during instanceof checks.
     * Same applies to all derived classes.
     * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md
     * #extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, DeprecatedApiError.prototype);
  }
  reportUsage(apiKind) {
    if (
      typeof OneSignal !== "undefined" &&
      OneSignal.context &&
      OneSignal.context.metricsManager
    ) {
      OneSignal.context.metricsManager.reportEvent(
        new ApiUsageMetricEvent(apiKind)
      );
    }
  }
}
//# sourceMappingURL=DeprecatedApiError.js.map
