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

  constructor(private sessions: SessionsService) { }

  ngOnInit(): void {

  }

  addFile(event: any){
    let file = event.srcElement.files[0];
    if(file.type === 'application/json'){
      this.readFile(file)
    }else{
      this.messageInput = `El Archivo es incorrecto`;
    }
  };

  readFile(file: any): void{
    this.messageInput = `Cargo el archivo ${file.name}`;
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt: any) => {
      this.saveSecrets(JSON.parse(evt.target.result));
    };
  }

  saveSecrets(secrets: Secrets[]): void{
    this.sessions.secrets = secrets;
    this.sessions.setNext(true);
  }
}
