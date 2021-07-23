import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmailService } from './email.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
   
export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    EmailService,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AppComponent implements OnInit {
  stack = ['angular', 'react', 'vue'];
  versions = {
    "angular": ['1.1.1', '1.2.1', '1.3.3'],
    "react": ['2.1.2', '3.2.4', '4.3.1'],
    "vue": ['3.3.1', '5.2.1', '5.1.3']
  }
  
  constructor (private formBuilder: FormBuilder,
               private emailService: EmailService) {

  }

  myForm!: FormGroup;
  hobbies!: FormArray;

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      "firstName": ['', [Validators.required]],
      "lastName": ['', [Validators.required]],
      "date": [this.formateDate(new Date()), [Validators.required]],
      "tech": ['', [Validators.required]],
      "version": ['', [Validators.required]],
      "email": ['', [Validators.required, Validators.email], [this.emailAsyncValidator.bind(this)]],
      "hobbies": this.formBuilder.array([
        this.createHobby()
      ])
    })
    
  }

  formateDate(dateString: any) {
    let date = new Date(dateString);

    let dd:any = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var mm:any = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    var yy:any = date.getFullYear() % 100;
    if (yy < 10) {
        yy = '0' + yy;
    }
    
    return dd + '-' + mm + '-' + yy;
  }

  getTech() {
    return this.stack;
  }

  getVersions(version: string) {
    for (let [key, value] of Object.entries(this.versions)) {
      if (key === version) {
        return value;
      }
    }

    return [];
  }

  emailAsyncValidator(control: FormControl): Observable<ValidationErrors> {
    return this.emailService.validateEamil(control.value);
  }

  getHobbies(): FormArray {
    return this.myForm.controls['hobbies'] as FormArray
  }

  createHobby(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      duration: ['', Validators.required]
    })
  }

  addHobby() {
    let temp = this.myForm.controls.hobbies.value;
    if (temp[temp.length - 1] === '') {
      return;
    }
    (<FormArray>this.myForm.controls['hobbies']).push(this.createHobby())
  }

  submit() {
    this.myForm.value.date = this.formateDate(this.myForm.value.date);
    console.log(this.myForm.value)
  }
}
