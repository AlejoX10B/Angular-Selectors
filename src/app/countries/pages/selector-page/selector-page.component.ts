import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { MinCountry } from '../../interfaces/countries.interface';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: []
})
export class SelectorPageComponent {

  coForm: FormGroup = this.fb.group({
    region: [null, Validators.required],
    country: [null, Validators.required],
    border: [null, Validators.required]
  });

  regions: string[] = [];
  countries: MinCountry[] = [];
  borders: MinCountry[] = [];

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cs: CountriesService
  ) {

    this.regions = this.cs.regions;

    /*this.coForm.get('region')?.valueChanges
      .subscribe((region) => {

        this.cs.getCountriesByRegion(region)
          .subscribe((countries) => {
            console.log(countries);
            this.countries = countries;
          })
      })*/

    this.coForm.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          this.loading = true;

          this.countries = [];
          this.coForm.get('country')?.reset(null);
        }),
        switchMap(region => this.cs.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.loading = false;
        this.countries = countries;
      });

    this.coForm.get('country')?.valueChanges
      .pipe(
        tap(_ => {
          this.loading = true;

          this.borders = [];
          this.coForm.get('border')?.reset(null);
        }),
        switchMap(code => this.cs.getCountryByAlpha3Code(code)),
        switchMap( country => this.cs.getCountriesByAlpha3Code( country?.borders! ))
      )
      .subscribe(countries => {
        this.loading = false;
        this.borders = countries || [];
      });
  }

  save() {
    console.log(this.coForm.value);
  }

}
