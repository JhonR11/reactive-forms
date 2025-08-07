import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../services/interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder)

  countryServices = inject(CountryService)
  
  regions=signal( this.countryServices.regions)
  countriesByRegion = signal<Country[]>([])
  borders = signal<Country[]>([])


  myForm = this.fb.group({
    region:['', Validators.required],
    country:['', Validators.required],
    border:['', Validators.required]
  })


  onFormChanged= effect(( onClenaup)=>{
    const formRegionChanged = this.onRegionChanged()
    const countrySubscription = this.onCountryChanged()
      onClenaup(()=>{
        formRegionChanged.unsubscribe()
        countrySubscription.unsubscribe
      })

    })

  onRegionChanged(){

    return this.myForm.
      get('region')!.
      valueChanges.pipe(
        tap(()=>this.myForm.get('country')!.setValue('')),
        tap(()=>this.myForm.get('border')!.setValue('')),
        tap(()=>{
          this.borders.set([])
          this.countriesByRegion.set([])
        }),
        switchMap(region=>this.countryServices.getCountriesByRegion(region ?? ''))
      )
      .subscribe((countries)=>{this.countriesByRegion.set(countries)})
  }

  onCountryChanged() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) =>
          this.countryServices.getCountryByAlphaCode(alphaCode ?? '')
        ),
        switchMap((country) =>
          this.countryServices.getCountryNamesByCodeArray(country.borders)
        )
      )

      .subscribe((borders) => {
        this.borders.set(borders);
      });
  }
  


}
