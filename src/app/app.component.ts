import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalJsonErrorComponent } from './components/modal-json-error/modal-json-error.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'autoClaim';
  textNextBtn: string = 'Siguiente';

  next: boolean = true;

  constructor(public sessions: SessionsService, private router: Router, public dialog: MatDialog){}

  ngOnInit(): void {
    this.sessions.getNext().subscribe((processEnd: boolean)=>{
      this.next = !processEnd;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalJsonErrorComponent);
  }

  nextBtn(): void{
    this.next = true;
    this.sendAction();
    if(this.textNextBtn === 'Siguiente'){
      this.router.navigate(['/profiles']);
      this.textNextBtn = 'Claim Automatico';
    }else{
      this.textNextBtn = 'Transferir Slp';
    };
  }

  sendAction(): void{
    this.sessions.setNextAction(this.textNextBtn);
  }

}
