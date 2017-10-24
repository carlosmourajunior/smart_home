import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//É preciso importar o provideer.
import { DweetProvider } from '../../providers/dweet/dweet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private dweetProvider: DweetProvider) {

  }

  //Declaração das Variáveis que serão usadas.
  public respostaDweet:string = "";
  public locais = new Array<any>();
  public temp = 0;
  public lumi = 0;
  
  //Declaração da Model que irá ajustar o Toogle Button do Relé.
  public rele_model = {
    checked: false,
    name: "Relé"
  }

  //Declaração da Model que irá ajustar o Toogle Button do LED.
  public led_model = {
    checked: false,
    name: "LED"
  }

  ionViewDidLoad () {
    //buscando os dados no Dweet e salvando nas variáies locais
    this.dweetProvider.getLastestDweet("inatel_ead").subscribe(
      data=>{
        const response = (data as any);
        const objeto_retorno = JSON.parse(response._body);          
        this.locais = objeto_retorno.with[0].content;
        this.led_model.checked = objeto_retorno.with[0].content.led;
        this.rele_model.checked = objeto_retorno.with[0].content.rele;          
        this.temp = objeto_retorno.with[0].content.Temperatura;
        this.lumi = objeto_retorno.with[0].content.Luminosidade;

        console.log(this.locais);             
        
      },
      error => {
        console.log(error);
      }
    )
  }

  update() {
    this.ionViewDidLoad();
  }
  //mudando o estado do LED
  change_led(){        
    this.dweetPost();
    console.log(this.led_model.checked);    
  }

  //Mudando o estado do Relé
  change_rele(){    
    this.dweetPost();
    console.log(this.rele_model.checked);
    
  }

  dweetPost(){
    //Convertendo os dados de Boolean para Int.
    const led = ((this.led_model.checked == true) ? 1 : 0 );
    const rele = ((this.rele_model.checked == true) ? 1 : 0 );

    //Enviando os dados para o Dweet.io
    const json_dweet = {"led": led, "rele": rele, "Temperatura": this.temp, "Luminosidade": this.lumi};
    this.dweetProvider.setDweet("inatel_ead",json_dweet).subscribe(
      data=>{
        console.log(data);
      },
      error=> {
        console.log(error);
      }
    )
  }

}
