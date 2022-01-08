import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';
import { AutoClaimService } from '../services/autoClaim/auto-claim.service';
import { Secrets } from '../models/interfaces';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-process-claim',
  templateUrl: './process-claim.component.html',
  styleUrls: ['./process-claim.component.sass']
})
export class ProcessClaimComponent implements OnInit {

  @Input() claimOrTransfer!: string; 
  @Output() finalizar = new EventEmitter<boolean>();

  errorSuccess: number = 0;
  claimSuccess: number = 0;
  errrorClaim: Secrets[] = [];
  mode: ProgressSpinnerMode = 'indeterminate';
  color: string = 'primary';
  value: number = 100;
  iconView: boolean = false;

  roninAcademia: string = '';

  constructor(public sessions: SessionsService, private autoClaim: AutoClaimService) { }

  ngOnInit(): void {
    if(this.claimOrTransfer === 'Claim Automatico'){
      this.claimSlp(this.sessions.secrets);
    }else{
      this.payments(this.sessions.secrets);
    }
  }

  async claimSlp(secrets: Secrets[]): Promise<void>{
    await Promise.all(
      secrets.map(secret=>{
        return this.autoClaim.startClaimSlp(secret.ronin, secret.secret)
        .then(result=>{
          this.claimSuccess += 1;
        }).catch(error=>{
          this.errrorClaim.push(secret);
          this.errorSuccess += 1;
        });
      })
    );
    this.changeSpiner();
  };

  changeSpiner(): void{
    this.mode = 'determinate';
    this.iconView = true;
    if(this.errrorClaim.length !== 0){
      this.color = 'warn';
    }else{
      this.color = 'primary';
    };
  }

  endClain():void{
    this.finalizar.emit(false);
  }

  retryClaim(): void{
    let retryClaim: Secrets[] = [... this.errrorClaim];
    this.clearSpiner();
    this.errrorClaim = [];
    this.errorSuccess = 0;
    this.claimSlp(retryClaim);
  }

  clearSpiner(): void{
    this.mode = 'indeterminate';
    this.iconView = false;
  }

  async payments(secrets: Secrets[]): Promise<void>{
    await Promise.all(secrets.map((secret)=>{
      let amount: number = this.calcAmount(secret);
      if(amount != 0){
        secret.slp = (parseInt(secret.slp!) - amount).toString();
        return this.autoClaim.transferSlp(secret.ronin, secret.roninPersonal, secret.secret, amount)
        .then(resultTransfer => {
          secret.transferResult = resultTransfer;
        }).catch(resultError=>{
          secret.transferResult = resultError;
        });
      }else{
        return Promise.resolve();
      }
    }));
    console.log("completado pagos becados");
    await Promise.all(secrets.map((secret)=>{
      let amount: number = parseInt(secret.slp!);
      if(amount != 0 && secret.transferResult! === 'transfer successful'){
        return this.autoClaim.transferSlp(secret.ronin, this.roninAcademia, secret.secret, amount);
      }else{
        return Promise.resolve();
      }
    }));
    console.log("completado pagos Academia");
  }

  calcAmount(secret: Secrets): number{
    let amount: number = (parseInt(secret.slp!) * secret.ganancia) / 100;
    return parseInt(amount.toFixed(0));
  }
}
