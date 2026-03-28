import analytics from '@react-native-firebase/analytics';

/**
 * Log a generic analytics event.
 * @param {string} eventName
 * @param {Object} [params]
 */
export const logEvent = async (eventName, params = {}) => {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.warn(`[Analytics] logEvent("${eventName}") failed:`, error);
  }
};

/**
 * Log a screen view event.
 * @param {string} screenName
 * @param {string} [screenClass]
 */
export const logScreenView = async (screenName, screenClass) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  } catch (error) {
    console.warn(`[Analytics] logScreenView("${screenName}") failed:`, error);
  }
};

/**
 * Log an app open event with source attribution.
 * @param {string} [source='direct'] - One of 'direct', 'notification', 'deep_link'
 * @param {Object} [extraParams]
 */
export const logAppOpen = async (source = 'direct', extraParams = {}) => {
  try {
    await analytics().logEvent('app_open_attributed', {
      source,
      ...extraParams,
    });
  } catch (error) {
    console.warn(`[Analytics] logAppOpen("${source}") failed:`, error);
  }
};

/**
 * Set user properties for segmentation.
 * @param {Object} properties - Key-value pairs of user properties
 */
export const setUserProperties = async (properties = {}) => {
  try {
    const entries = Object.entries(properties);
    for (const [key, value] of entries) {
      await analytics().setUserProperty(key, value);
    }
  } catch (error) {
    console.warn('[Analytics] setUserProperties failed:', error);
  }
};

/**
 * Set the user ID for analytics.
 * @param {string} userId
 */
export const setUserId = async userId => {
  try {
    await analytics().setUserId(userId);
  } catch (error) {
    console.warn('[Analytics] setUserId failed:', error);
  }
};
