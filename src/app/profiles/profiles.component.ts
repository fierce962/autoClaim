import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Secrets, AxiesData } from '../models/interfaces';
import { SessionsService } from '../services/sessions/sessions.service';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { RoninWeb3 } from '../models/RoninWeb3';


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.sass']
})

export class ProfilesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'axies', 'slp', 'axs', 'weth'];
  imgView: number[] = [0, 1, 2];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Secrets> = new MatTableDataSource();
  roninWalet = new RoninWeb3();

  processClaim: boolean = false;
  action: string = '';
  loading: boolean = true;

  constructor(private sessions: SessionsService,
    private getAxies: GetAxiesService) { }

  ngOnInit(): void {
    this.getAxiesData(this.sessions.secrets);
    this.processAction();
  }

  async getAxiesData(secrets: Secrets[]): Promise<void>{
    let retryAxie: Secrets[] = [];
    await Promise.all(
      secrets.map(secrets=>{
        return this.createPerfil(secrets)
        .catch((secrets: Secrets) =>{
          retryAxie.push(secrets);
        });
      })
    );
    if(retryAxie.length !== 0){
      this.getAxiesData(retryAxie);
    }else{
      this.loadBalancePerfil();
      this.loadTable();
    }
    this.sessions.setNext(true);
  };

  async createPerfil(secrets: Secrets){
    return await this.getAxies.get(secrets).then((axies: AxiesData[])=>{
      secrets.axies = [];
      axies.forEach(axie=> secrets.axies!.push(axie.image));
    });
  };

  async loadBalancePerfil(): Promise<void>{
    await Promise.all(
      this.sessions.secrets.map((secret)=>{
        return this.getCrytoRonin(secret);
      })
    );
    this.loading = false;
  };

  async getCrytoRonin(secret: Secrets){
    this.getRoninCryto(secret.ronin, this.roninWalet.AXS_CONTRACT).then(Balance =>{
      secret.axs = this.parseWeth(Balance);
    });
    this.getRoninCryto(secret.ronin, this.roninWalet.WETH_CONTRACT).then(Balance =>{
      secret.weth = this.parseWeth(Balance);
    });
    return this.getRoninCryto(secret.ronin, this.roninWalet.SLP_CONTRACT).then(Balance =>{
      return secret.slp = Balance;
    });
  };

  async getRoninCryto(ronin: string, contract: string): Promise<string>{
    return await this.roninWalet.getBalance(contract, ronin);
  };

  parseWeth(weth: string): string{
    return parseFloat(this.roninWalet.web3.utils.fromWei(weth)).toFixed(5);
  };

  loadTable():void {
    this.dataSource = new MatTableDataSource(this.sessions.secrets);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  };

  processAction(): void{
    this.sessions.getNextAction().subscribe(action=>{
      this.action = action;
      this.processClaim = true;
    });
  };

  async endClaimOrTransfer(eventEmit: boolean): Promise<void>{
    this.loading = true;
    this.processClaim = eventEmit;
    this.sessions.setNext(true);
    await this.loadBalancePerfil();
    this.loadTable();
  }
}
