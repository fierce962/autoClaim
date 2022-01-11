import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { Secrets } from 'src/app/models/interfaces';

@Component({
  selector: 'app-modal-json-error',
  templateUrl: './modal-json-error.component.html',
  styleUrls: ['./modal-json-error.component.sass']
})
export class ModalJsonErrorComponent implements OnInit {

  secretsError: Secrets[] = [];

  constructor(private sessions: SessionsService) { }

  ngOnInit(): void {
    this.secretsError = [... this.sessions.errorSecrets];
  }

}
