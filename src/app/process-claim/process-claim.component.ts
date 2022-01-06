import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';
import { AutoClaimService } from '../services/autoClaim/auto-claim.service';
import { Secrets } from '../models/interfaces';

@Component({
  selector: 'app-process-claim',
  templateUrl: './process-claim.component.html',
  styleUrls: ['./process-claim.component.sass']
})
export class ProcessClaimComponent implements OnInit {

  @Output() finalizar = new EventEmitter<boolean>();

  errorSuccess: number = 0;
  claimSuccess: number = 0;
  errrorClaim: Secrets[] = [];

  constructor(public sessions: SessionsService, private autoClaim: AutoClaimService) { }

  ngOnInit(): void {
    this.claimSlp();
  }

  async claimSlp(): Promise<void>{
    console.log('clain')
    await Promise.all(
      this.sessions.secrets.map(secret=>{
        return this.autoClaim.startClaimSlp(secret.ronin, secret.secret)
        .then(result=>{
          this.claimSuccess += 1;
        }).catch(error=>{
          this.errrorClaim.push(secret);
          this.errorSuccess += 1;
        });
      })
    );
  };

  endClain():void{
    this.finalizar.emit(false);
  }
}
