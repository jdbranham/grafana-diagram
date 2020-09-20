import Analytics from './libs/analytics/dist/analytics.min'
import googleAnalytics from './libs/@analytics/google-analytics/dist/@analytics/google-analytics.min'

class wrapper {
    track(action, props) {
        if (this._analytics) {
            setTimeout(() => this._analytics.track(action, props));
        }
    }
    constructor(_analytics) {
        this._analytics = _analytics;
    }
};
 
function createAnalytics() {
    return Analytics._analytics.default({
        app: 'diagram-pligin',
        plugins: [
          googleAnalytics({
            trackingId: 'UA-178409998-1',
            /* Anonymize the IP addresses */
            anonymizeIp: true,
            instanceName: 'gaDiagram',
            cookieConfig: {
              cookieName: '_gaDiagram'
            },
            /* Google Analytics custom dimensions here */
            customDimensions: {
              pluginVersion: 'dimension1'
            },
          }, {
              name: 'diagram-analytics'
          })
        ]
    });
}

export function initAnalytics(enabled) {
    if(enabled) {
        return new wrapper(createAnalytics());
    } else {
        return new wrapper();
    }
}