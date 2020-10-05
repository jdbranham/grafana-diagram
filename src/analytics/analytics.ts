import { Analytics, AnalyticsInstance } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

export interface AnalyticsOptions {
  version: string;
  enabled: boolean;
}

export interface TrackEventOptions {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export interface DiagramAnalytics {
  track: (action: string, props?: TrackEventOptions) => void;
}

class DiagramAnalyticsImpl implements DiagramAnalytics {
  _analytics?: AnalyticsInstance;
  _options?: AnalyticsOptions;
  track(action: string, props?: TrackEventOptions) {
    if (this._analytics) {
      props = props || {};
      props.pluginVersion = this._options?.version;
      this._analytics.track(action, props);
    }
  }
  constructor(_analytics?: AnalyticsInstance, options?: AnalyticsOptions) {
    if (_analytics) {
      this._analytics = _analytics;
      this._options = options;
    }
  }
}

function createAnalytics(options: AnalyticsOptions) {
  return Analytics({
    app: 'diagram-plugin',
    version: options.version, // doesnt appear to work, so will configure as a custom dimension
    plugins: [
      googleAnalytics(
        {
          trackingId: 'UA-178409998-1',
          /* Anonymize the IP addresses */
          anonymizeIp: true,
          instanceName: 'gaDiagram',
          cookieConfig: {
            cookieName: '_gaDiagram',
          },
          /* Google Analytics custom dimensions */
          customDimensions: {
            pluginVersion: 'dimension1',
          },
        },
        {
          name: 'diagram-analytics',
        }
      ),
    ],
  });
}

export function initAnalytics(options: AnalyticsOptions) {
  if (options.enabled) {
    return new DiagramAnalyticsImpl(createAnalytics(options), options);
  } else {
    return new DiagramAnalyticsImpl();
  }
}
