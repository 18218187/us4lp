import {
  InvalidStateError,
  InvalidStateReason,
} from "../errors/InvalidStateError";
import Event from "../Event";
import SdkEnvironment from "../managers/SdkEnvironment";
import Database from "../services/Database";
import Log from "../libraries/Log";
import { SubscriptionStateKind } from "../models/SubscriptionStateKind";
import { NotificationPermission } from "../models/NotificationPermission";
import { PushDeviceRecord } from "../models/PushDeviceRecord";
import { OneSignalUtils } from "../utils/OneSignalUtils";
import { PermissionUtils } from "../utils/PermissionUtils";
import { Utils } from "../context/shared/utils/Utils";
import SubscriptionHelper from "./SubscriptionHelper";
export default class MainHelper {
  static async getCurrentNotificationType() {
    const currentPermission =
      await OneSignal.context.permissionManager.getNotificationPermission(
        OneSignal.context.appConfig.safariWebId
      );
    if (currentPermission === NotificationPermission.Default) {
      return SubscriptionStateKind.Default;
    }
    if (currentPermission === NotificationPermission.Denied) {
      // Due to this issue https://github.com/OneSignal/OneSignal-Website-SDK/issues/289 we cannot reliably detect
      // "default" permission in HTTP context. Browser reports denied for both "default" and "denied" statuses.
      // Returning SubscriptionStateKind.Default for this case.
      return OneSignalUtils.isUsingSubscriptionWorkaround()
        ? SubscriptionStateKind.Default
        : SubscriptionStateKind.NotSubscribed;
    }
    const existingUser =
      await OneSignal.context.subscriptionManager.isAlreadyRegisteredWithOneSignal();
    if (currentPermission === NotificationPermission.Granted && existingUser) {
      const isPushEnabled = await OneSignal.privateIsPushNotificationsEnabled();
      return isPushEnabled
        ? SubscriptionStateKind.Subscribed
        : SubscriptionStateKind.MutedByApi;
    }
    return SubscriptionStateKind.Default;
  }
  /**
   * If the user has manually opted out of notifications (OneSignal.setSubscription), returns -2; otherwise returns 1.
   * @param isOptedIn The result of OneSignal.getSubscription().
   */
  static getNotificationTypeFromOptIn(isOptedIn) {
    if (isOptedIn == true || isOptedIn == null) {
      return SubscriptionStateKind.Subscribed;
    } else {
      return SubscriptionStateKind.MutedByApi;
    }
  }
  /**
   * Stores a flag in sessionStorage that we've already shown the HTTP slidedown to this user and that we should not
   * show it again until they open a new window or tab to the site.
   */
  static markHttpSlidedownShown() {
    sessionStorage.setItem("ONESIGNAL_HTTP_PROMPT_SHOWN", "true");
  }
  /**
   * Returns true if the HTTP slidedown was already shown inside the same session.
   */
  static isHttpPromptAlreadyShown() {
    return sessionStorage.getItem("ONESIGNAL_HTTP_PROMPT_SHOWN") == "true";
  }
  static async checkAndTriggerNotificationPermissionChanged() {
    const previousPermission = await Database.get(
      "Options",
      "notificationPermission"
    );
    const currentPermission = await OneSignal.getNotificationPermission();
    if (previousPermission !== currentPermission) {
      await PermissionUtils.triggerNotificationPermissionChanged();
      await Database.put("Options", {
        key: "notificationPermission",
        value: currentPermission,
      });
    }
  }
  static async getNotificationIcons() {
    const appId = await MainHelper.getAppId();
    if (!appId) {
      throw new InvalidStateError(InvalidStateReason.MissingAppId);
    }
    const url = `${SdkEnvironment.getOneSignalApiUrl().toString()}/apps/${appId}/icon`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.errors) {
      Log.error(
        `API call %c${url}`,
        Utils.getConsoleStyle("code"),
        "failed with:",
        data.errors
      );
      throw new Error("Failed to get notification icons.");
    }
    return data;
  }
  static getSlidedownOptions(promptOptions) {
    return Utils.getValueOrDefault(promptOptions.slidedown, { prompts: [] });
  }
  static getFullscreenPermissionMessageOptions(promptOptions) {
    if (!promptOptions) {
      return null;
    }
    if (!promptOptions.fullscreen) {
      return promptOptions;
    }
    return {
      autoAcceptTitle: promptOptions.fullscreen.autoAcceptTitle,
      actionMessage: promptOptions.fullscreen.actionMessage,
      exampleNotificationTitleDesktop: promptOptions.fullscreen.title,
      exampleNotificationTitleMobile: promptOptions.fullscreen.title,
      exampleNotificationMessageDesktop: promptOptions.fullscreen.message,
      exampleNotificationMessageMobile: promptOptions.fullscreen.message,
      exampleNotificationCaption: promptOptions.fullscreen.caption,
      acceptButton: promptOptions.fullscreen.acceptButton,
      cancelButton: promptOptions.fullscreen.cancelButton,
    };
  }
  static getPromptOptionsQueryString() {
    const promptOptions = MainHelper.getFullscreenPermissionMessageOptions(
      OneSignal.config.userConfig.promptOptions
    );
    let promptOptionsStr = "";
    if (promptOptions) {
      const hash = MainHelper.getPromptOptionsPostHash();
      for (const key of Object.keys(hash)) {
        var value = hash[key];
        promptOptionsStr += "&" + key + "=" + value;
      }
    }
    return promptOptionsStr;
  }
  static getPromptOptionsPostHash() {
    const promptOptions = MainHelper.getFullscreenPermissionMessageOptions(
      OneSignal.config.userConfig.promptOptions
    );
    if (promptOptions) {
      var legacyParams = {
        exampleNotificationTitleDesktop: "exampleNotificationTitle",
        exampleNotificationMessageDesktop: "exampleNotificationMessage",
        exampleNotificationTitleMobile: "exampleNotificationTitle",
        exampleNotificationMessageMobile: "exampleNotificationMessage",
      };
      for (const legacyParamKey of Object.keys(legacyParams)) {
        const legacyParamValue = legacyParams[legacyParamKey];
        if (promptOptions[legacyParamKey]) {
          promptOptions[legacyParamValue] = promptOptions[legacyParamKey];
        }
      }
      var allowedPromptOptions = [
        "autoAcceptTitle",
        "siteName",
        "autoAcceptTitle",
        "subscribeText",
        "showGraphic",
        "actionMessage",
        "exampleNotificationTitle",
        "exampleNotificationMessage",
        "exampleNotificationCaption",
        "acceptButton",
        "cancelButton",
        "timeout",
      ];
      var hash = {};
      for (var i = 0; i < allowedPromptOptions.length; i++) {
        var key = allowedPromptOptions[i];
        var value = promptOptions[key];
        var encoded_value = encodeURIComponent(value);
        if (value || value === false || value === "") {
          hash[key] = encoded_value;
        }
      }
    }
    return hash;
  }
  static triggerCustomPromptClicked(clickResult) {
    Event.trigger(OneSignal.EVENTS.CUSTOM_PROMPT_CLICKED, {
      result: clickResult,
    });
  }
  static async getAppId() {
    if (OneSignal.config.appId) {
      return Promise.resolve(OneSignal.config.appId);
    } else {
      const appId = await Database.get("Ids", "appId");
      return appId;
    }
  }
  static async createDeviceRecord(appId, includeSubscription = false) {
    let subscription;
    if (includeSubscription) {
      // TODO: refactor to replace config with dependency injection
      const rawSubscription = await SubscriptionHelper.getRawPushSubscription(
        OneSignal.environmentInfo,
        OneSignal.config.safariWebId
      );
      if (rawSubscription) {
        subscription = rawSubscription;
      }
    }
    const deviceRecord = new PushDeviceRecord(subscription);
    deviceRecord.appId = appId;
    deviceRecord.subscriptionState =
      await MainHelper.getCurrentNotificationType();
    return deviceRecord;
  }
  static async getDeviceId() {
    const subscription = await OneSignal.database.getSubscription();
    return subscription.deviceId || undefined;
  }
}
//# sourceMappingURL=MainHelper.js.map
