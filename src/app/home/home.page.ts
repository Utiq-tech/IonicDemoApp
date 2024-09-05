import { ChangeDetectorRef, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonList, ToastController, Platform, IonSpinner } from '@ionic/angular/standalone';
import { UTIQ } from 'utiq-tech';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonLabel, IonList, IonItem, IonSpinner, CommonModule],
})
export class HomePage {

  mtid: any;
  atid: any;
  isLoading: boolean = false;
  isMovil: boolean = true;
  isIntialized: boolean = false;
  stubToken: string = "523393b9b7aa92a534db512af83084506d89e965b95c36f982200e76afcb82cb";

  constructor(private toastController: ToastController, private platform: Platform, private cdr: ChangeDetectorRef) {
    this.isMovil = platform.is('android') || platform.is('ios');

    UTIQ.addListener('onFlowCompleted', (info: any) => {
      let text = `onFlowCompleted -> status: ` + Object.values(info)[0];
      console.log(text);
      this.presentToast(text);
      this.stopLoading();
    });
    UTIQ.addListener('onConsentUpdateFinished', (info: any) => {
      console.log(`onConsentUpdateFinished -> isConsentGranted: ` + Object.values(info)[0]);
    });
    UTIQ.addListener('onEligibilityChecked', (info: any) => {
      console.log(`onEligibilityChecked -> isEligible: ` + Object.values(info)[0]);
    });
    UTIQ.addListener('onInitialised', () => {
      this.isIntialized = true;
      this.presentToast('Success Initialization.');
      console.log(`onInitialised`);
    });
    UTIQ.addListener('onConsentManagerStatusChanged', (info: any) => {
      console.log(`onConsentManagerStatusChanged -> status: ` + Object.values(info)[0]);
    });
    UTIQ.addListener('onIdsAvailable', (info: any) => {
      this.atid = Object.values(info)[0];
      this.mtid = Object.values(info)[1];
      console.log(`onIdsAvailable -> mtid: ` + this.mtid + ` , atid: ` + this.atid);
      this.presentToast('Success fetching IDs.');
      this.stopLoading();
    });
  };

  async initialize() {
    if(!this.isIntialized){
      const config = { sdkToken: 'R&Ai^v>TfqCz4Y^HH2?3uk8j', configParams: JSON.stringify(environment.utiq), sdkOptions: { enableLogging: true } };
      UTIQ.initialize(config);
    }
  }
  async acceptConsent() {
    UTIQ.acceptConsent();
    this.presentToast('Consent Accepted.');
  }
  async rejectConsent() {
    this.atid = "";
    this.mtid = "";
    UTIQ.rejectConsent();
    this.presentToast('Consent Rejected.');
  }
  async startService() {
    this.isLoading = true;
    UTIQ.startService({ stubToken: this.stubToken });
  }
  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }
  stopLoading(){
    this.isLoading = false;
    this.cdr.detectChanges();
  }
}
