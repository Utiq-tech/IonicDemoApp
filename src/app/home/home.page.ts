import { ChangeDetectorRef, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonList, ToastController, Platform, IonSpinner, AlertController } from '@ionic/angular/standalone';
import { UTIQ } from "utiq-sdk"
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { IdConnectData } from 'utiq-sdk';

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

  constructor(private toastController: ToastController, private platform: Platform, private cdr: ChangeDetectorRef, private alertController: AlertController) {
    this.isMovil = platform.is('android') || platform.is('ios');

    UTIQ.addListener('onFlowCompleted', (value: { error: string }) => {
      let errorText = '';
      if (value != null && value.error != null) {
        errorText = ` -> ${value.error}`;
      }
      let text = `onFlowCompleted${errorText}`;
      console.log(text);
      this.presentToast(text);
      this.stopLoading();
    });
    UTIQ.addListener('onConsentUpdateFinished', (value: { isConsentGranted: boolean }) => {
      let text = `onConsentUpdateFinished -> status: ` + value.isConsentGranted;
      console.log(text);
      this.presentToast(text);
    });
    UTIQ.addListener('onEligibilityChecked', (value: { isEligible: boolean }) => {
      let text = `onEligibilityChecked -> isEligible: ` + value.isEligible;
      console.log(text);
      this.presentToast(text);
      if (value.isEligible && this.isMovil) {
        this.presentConsent();
      }
    });
    UTIQ.addListener('onInitialised', () => {
      this.isIntialized = true;
      this.presentToast('Success Initialization.');
      console.log(`onInitialised`);
    });
    UTIQ.addListener('onConsentManagerStatusChanged', (value: { status: boolean }) => {
      console.log(`onConsentManagerStatusChanged -> status: ` + value.status);
    });
    UTIQ.addListener('onIdsAvailable', ({ adTechPass, marTechPass }) => {
      this.atid = adTechPass;
      this.mtid = marTechPass;
      console.log(`onIdsAvailable -> mtid: ` + marTechPass + ` , atid: ` + adTechPass);
      this.presentToast('Success fetching IDs.');
      this.stopLoading();
    });
  };

  initialize() {
    if (!this.isIntialized) {
      const config = { sdkToken: 'R&Ai^v>TfqCz4Y^HH2?3uk8j', configParams: JSON.stringify(environment.utiq), sdkOptions: { enableLogging: true } };
      UTIQ.initialize(config);
    }
  }

  async checkMNOEligibility() {
    await UTIQ.checkMNOEligibility({ stubToken: this.stubToken });
  }

  async fetchIdConnectData() {
    const idConnectData: IdConnectData = await UTIQ.idConnectData();
    if (idConnectData) {
      if (idConnectData.marTechPass != '') {
        this.atid = idConnectData.adTechPass;
        this.mtid = idConnectData.marTechPass;
        this.stopLoading();
        return;
      }
      if (!this.isMovil) {
        this.isLoading = true;
        const showConsent = await UTIQ.fetchIdConnectData({ stubToken: this.stubToken });
        if(showConsent){
          //window.Utiq.API.showConsentManager();
        }
      }
      else {
        const { status: isConsentAccepted } = await UTIQ.isConsentAccepted();
        if (isConsentAccepted) {
          this.isLoading = true;
          UTIQ.fetchIdConnectData({ stubToken: this.stubToken });
        }
        else {
          this.presentConsent(true);
        }
      }
    }
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  stopLoading() {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  handleDataClear() {
    this.atid = "";
    this.mtid = "";
    UTIQ.handleDataClear();
    this.presentToast('Utiq data was removed.');
  }

  async presentConsent(callFetchIds: boolean = false) {
    const alert = await this.alertController.create({
      header: 'UTIQ Consent',
      message: 'Do you agree to UTIQ using your network data for marketing purposes?',
      buttons: [
        {
          text: 'Reject',
          role: 'cancel',
          handler: () => {
            this.atid = "";
            this.mtid = "";
            UTIQ.rejectConsent();
            this.presentToast('Consent Rejected.');
          }
        },
        {
          text: 'Accept',
          handler: () => {
            UTIQ.acceptConsent();
            this.presentToast('Consent Accepted.');
            if(callFetchIds){
              this.isLoading = true;
              UTIQ.fetchIdConnectData({ stubToken: this.stubToken });
            }
          }
        }
      ]
    });

    await alert.present();
  }
}

