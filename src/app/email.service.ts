import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators'
@Injectable()
export class EmailService {
 private users: string[];
 constructor() {
  this.users = ['test@test.test'];
 }

 validateEamil(userEmail: string): Observable<ValidationErrors> {
  return new Observable<ValidationErrors>(observer => {
   const user = this.users.find(user => user === userEmail);
   if (user) {
    observer.next({
     nameError: 'Such email is existed'
    });
     observer.complete();
    }

    observer.next(undefined);
    observer.complete();
   }).pipe(delay(2000));
  }
}