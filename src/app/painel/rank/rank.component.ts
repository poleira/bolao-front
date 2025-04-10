import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css'],
})
export class RankComponent implements OnInit {
  customers: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  };

  ngOnInit(): void {
    this.http
      .get('https://localhost:7288/api/Rank')
      .subscribe({
        next: (result: any) => {
          this.customers = result;
          console.log(result);
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
  }
}
