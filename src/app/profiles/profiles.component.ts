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

  processBarView: boolean = false;

  constructor(private sessions: SessionsService,
    private getAxies: GetAxiesService) { }

  ngOnInit(): void {
    this.getAxiesData(this.sessions.secrets);
    this.processBar();
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

  loadBalancePerfil(): void{
    this.sessions.secrets.forEach((secret)=>{
      this.getCrytoRonin(secret);
    });
  };

  getCrytoRonin(secret: Secrets): void{
    this.getRoninCryto(secret.ronin, this.roninWalet.SLP_CONTRACT).then(Balance =>{
      secret.slp = Balance;
    });
    this.getRoninCryto(secret.ronin, this.roninWalet.AXS_CONTRACT).then(Balance =>{
      secret.axs = this.parseWeth(Balance);
    });
    this.getRoninCryto(secret.ronin, this.roninWalet.WETH_CONTRACT).then(Balance =>{
      secret.weth = this.parseWeth(Balance);
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

  processBar(): void{
    this.sessions.getNextAction().subscribe(action=>{
      if(action === 'Transferir Slp'){
        this.processBarView = true;
      }
    });
  };

  endProcess(eventEmit: boolean): void{
    this.processBarView = eventEmit;
  }
}
