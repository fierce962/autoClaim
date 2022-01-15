import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';
import { AutoClaimService } from '../services/autoClaim/auto-claim.service';
import { Secrets } from '../models/interfaces';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-process-claim',
  templateUrl: './process-claim.component.html',
  styleUrls: ['./process-claim.component.sass']
})
export class ProcessClaimComponent implements OnInit {

  @Input() claimOrTransfer!: string; 
  @Output() finalizar = new EventEmitter<boolean>();

  errors: number = 0;
  success: number = 0;

  transferSuccess: number = 0;

  errrorTransaction: Secrets[] = [];

  errorTransactionAcademy: Secrets[] = [];

  mode: ProgressSpinnerMode = 'indeterminate';
  color: string = 'primary';
  value: number = 100;
  iconView: boolean = false;

  secretsAvailable: Secrets[] = [];

  viewForm: boolean = false;

  roninAcademy = new FormControl('', Validators.required); 

  constructor(public sessions: SessionsService, private autoClaim: AutoClaimService) { }

  ngOnInit(): void {
    if(this.claimOrTransfer === 'Claim Automatico'){
      this.claimSlp(this.sessions.secrets);
    }else{
      this.viewForm = true;
    }
  }

  async claimSlp(secrets: Secrets[]): Promise<void>{
    await Promise.all(
      secrets.map(secret=>{
        return this.autoClaim.startClaimSlp(secret.ronin, secret.secret)
        .then(result=>{
          this.success += 1;
          secret.transaction = 'si';
        }).catch(error=>{
          this.errrorTransaction.push(secret);
          this.errors += 1;
          secret.transaction = 'no';
        });
      })
    );
    this.changeSpiner();
  };

  changeSpiner(): void{
    this.mode = 'determinate';
    this.iconView = true;
    if(this.errrorTransaction.length !== 0){
      this.color = 'warn';
    }else{
      this.color = 'primary';
    };
  }

  endClain():void{
    this.finalizar.emit(false);
  }

  async retryTransaction(): Promise<void>{
    let retryClaim: Secrets[] = [... this.errrorTransaction];
    this.clearSpiner();
    this.errrorTransaction = [];
    this.errors = 0;
    if(this.claimOrTransfer === 'Claim Automatico'){
      this.claimSlp(retryClaim);
    }else{
      let retryPaymentAcademy: Secrets[] = [... this.errorTransactionAcademy];
      this.errorTransactionAcademy = [];
      await this.paymentsAcademy(retryPaymentAcademy);
      await this.filterPayments(this.errrorTransaction);
    }
  }

  clearSpiner(): void{
    this.mode = 'indeterminate';
    this.iconView = false;
  }

  startPayments(): void{
    this.viewForm = false;
    this.filterPayments(this.sessions.secrets);
  }

  async filterPayments(secrets: Secrets[]): Promise<void>{
    this.secretsAvailable = secrets.filter(secrets => parseInt(secrets.slp!) != 0);
    //await this.paymentsBecados(this.secretsAvailable);
    await this.paymentsAcademy(this.secretsAvailable);
    this.changeSpiner();
  }

  async paymentsBecados(secrets: Secrets[]): Promise<void>{
    await Promise.all(secrets.map((secret)=>{
      let amount: number = this.calcAmount(secret);
      secret.slp = (parseInt(secret.slp!) - amount).toString();
      return this.autoClaim.transferSlp(secret.ronin, secret.roninPersonal, secret.secret, amount)
      .then(resultTransfer => {
        secret.transferResult = resultTransfer;
        this.success += 1;
      }).catch(resultError=>{
        this.errrorTransaction.push(secret);
        secret.transferResult = resultError;
        this.errors += 1; 
      });
    }));
    console.log("completado pagos becados");
  }

  async paymentsAcademy(secrets: Secrets[]): Promise<void>{
    await Promise.all(secrets.map((secret)=>{
      let amount: number = parseInt(secret.slp!);
      if(secret.transferResult! === 'transfer successful' || secret.ganancia === 0){
        return this.autoClaim.transferSlp(secret.ronin, this.roninAcademy.value, secret.secret, amount)
        .then(result=>{
          this.transferSuccess += 1;
          secret.transaction = 'si';
        }).catch(errors=>{
          secret.transaction = 'no';
          this.errorTransactionAcademy.push(secret);
        });
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
