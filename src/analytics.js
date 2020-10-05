import Analytics from './libs/analytics/dist/analytics.min'
import googleAnalytics from './libs/@analytics/google-analytics/dist/@analytics/google-analytics.min'

const version = '1.6.4';

class wrapper {
    track(action, props) {
        if (this._analytics) {
            props = props || {};
            props.pluginVersion = version;
            setTimeout(() => this._analytics.track(action, props));
        }
    }
    constructor(_analytics) {
        this._analytics = _analytics;
    }
};
 
function createAnalytics() {
    return Analytics._analytics.default({
        app: 'diagram-plugin',
        version: version, // doesnt appear to work, so will configure as a custom dimension
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

export function initAnalytics(enabled) {
    if(enabled) {
        return new wrapper(createAnalytics());
    } else {
        return new wrapper();
    }
}