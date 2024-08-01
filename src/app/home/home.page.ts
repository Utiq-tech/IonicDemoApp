import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UTIQ, SdkInitializerParams, SdkOptions } from 'utiq-tech';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() {

    //utiq-web-sdk actions definition
    window.Utiq ||= {};
    window.Utiq.config ||= {};
    window.Utiq.config.customUtiqHost = `https://utiq-test.utest1.work`
    window.Utiq.config.listeners = {
      onFlowCompleted: (value: { status: string }) => {
        console.log(`onFlowCompleted -> status: ` + value.status);
      },
      onConsentUpdateFinished: (value: { isConsentGranted: boolean }) => {
        console.log(`onConsentUpdateFinished -> isConsentGranted: ` + value.isConsentGranted);
      },
      onEligibilityChecked: (value: { isEligible: string }) => {
        console.log(`onEligibilityChecked -> isEligible: ` + value.isEligible);
      },
      onInitialised: () => console.log(`onInitialised`),
      onConsentManagerStatusChanged: (value: { status: string }) => {
        console.log(`onConsentManagerStatusChanged -> status: ` + value.status);
      },
      onIdsAvailable: (value: { mtid: string, atid: string }) => {
        //this.mtid = value.mtid;
        //this.atid = value.atid;
        document.getElementById('btnRefresh')?.click();
        console.log(`onIdsAvailable -> mtid: ` + value.mtid + ` , atid: ` + value.atid);
      }
    };
  }

  async initialize() {
    const config = { sdkToken: 'R&Ai^v>TfqCz4Y^HH2?3uk8j', configParams: '', sdkOptions: { enableLogging: true } };
    await UTIQ.initialize(config);
  }


}
