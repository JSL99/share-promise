import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromiseService {

  constructor(
    private http: HttpClient
  ) { }

  public getUser(): Observable<any> {
    return this.http.get('http://www.baid.com')
    .pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
