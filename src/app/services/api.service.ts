import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getRandomJoke() {
    return this.http.get('https://api.chucknorris.io/jokes/random');
  }
}
