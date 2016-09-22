import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';

export class DiagramCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.updateClock();
  }

  updateClock() {
    this.time = moment().format('hh:mm:ss');
    this.$timeout(() => { this.updateClock(); }, 1000);
  }
}

DiagramCtrl.templateUrl = 'module.html';