import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonList, ToastController, Platform, isPlatform } from '@ionic/angular/standalone';
import { UTIQ } from 'utiq-tech';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonLabel, IonList, IonItem],
})
export class HomePage {

  mtid: any;
  atid: any;
  isMovil: boolean = false;

  constructor(private toastController: ToastController, private platform: Platform) {
    this.isMovil = platform.is('android') || platform.is('ios');

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
        this.mtid = value.mtid;
        this.atid = value.atid;
        document.getElementById('btnRefresh')?.click();
        console.log(`onIdsAvailable -> mtid: ` + value.mtid + ` , atid: ` + value.atid);
      }
    };

    //utiq-mobil-sdk actions definition
    UTIQ.addListener('toast', (info: any) => {
      this.presentToast('' + Object.values(info));
    });
    UTIQ.addListener('updateIds', (info: any) => {
      this.atid = Object.values(info)[0];
      this.mtid = Object.values(info)[1];
      document.getElementById('btnRefresh')?.click();
      this.presentToast('Success');
    });
  };

  async initialize() {
    const config = { sdkToken: 'R&Ai^v>TfqCz4Y^HH2?3uk8j', configParams: JSON.stringify(environment.utiq), sdkOptions: { enableLogging: true } };
    await UTIQ.initialize(config);
  }
  async acceptConsent() {
    await UTIQ.acceptConsent();
  }
  async rejectConsent() {
    await UTIQ.rejectConsent();
  }
  async startService(stubToken: string) {
    await UTIQ.startService({ stubToken: stubToken });
  }
  async presentToast(text: string) {
    console.log('console.log: ' + text);
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }
}
