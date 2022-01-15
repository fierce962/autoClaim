import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';
import { Secrets } from '../models/interfaces';
@Component({
  selector: 'app-load-file-secret',
  templateUrl: './load-file-secret.component.html',
  styleUrls: ['./load-file-secret.component.sass']
})
export class LoadFileSecretComponent implements OnInit {

  messageInput: string = 'Arrastre y suelte el archivo secrets';

  jsonError: boolean = false;

  constructor(private sessions: SessionsService) { }

  ngOnInit(): void {

  }

  addFile(event: any){
    let file = event.srcElement.files[0];
    if(file.type === 'application/json'){
      this.readFile(file)
      this.jsonError = false;
    }else{
      this.messageInput = `El Archivo es incorrecto`;
      this.jsonError = true;
    }
  };

  readFile(file: any): void{
    this.messageInput = `Cargo el archivo ${file.name}`;
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt: any) => {
      this.verifyData(JSON.parse(evt.target.result));
    };
  }

  verifyData(secrets: Secrets[]): void{
    secrets.forEach(secret=>{
      if(secret.ronin === '' || secret.roninPersonal === '' || secret.secret === ''){
        this.messageInput = 'el archivo tiene valores incorrectos';
        this.sessions.errorSecrets.push(secret);
      }else{
        this.saveSecrets(secrets);
      }
    });
  }

  saveSecrets(secrets: Secrets[]): void{
    this.sessions.secrets = secrets;
    this.sessions.setNext(true);
  }
}
