import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'autoClaim';
  textNextBtn: string = 'Siguiente';

  next: boolean = true;

  constructor(private sessions: SessionsService, private router: Router){}

  ngOnInit(): void {
    this.sessions.getNext().subscribe((processEnd: boolean)=>{
      this.next = !processEnd;
    });
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
