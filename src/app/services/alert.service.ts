import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl : AlertController) { }

  async showAlert(title:string, message: string){
    const alert = await this.alertCtrl.create({
      header: title || 'Información',
      message,
      cssClass: 'custom-alert',
      buttons: [],
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 3000); // Cerrar después de 3 segundos
  }

  async showConfirmAlert(message: string,
    header: string,
    confirmCallback: () => void
  ){
    const alert = await this.alertCtrl.create({
      header,
      message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            confirmCallback();
          },
        },
      ]
    });

    await alert.present();
  }
}
