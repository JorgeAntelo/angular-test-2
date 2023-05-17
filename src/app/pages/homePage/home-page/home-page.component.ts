import { ApiService } from './../../../services/api.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, interval, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { passwordValidator } from 'src/app/utils/validators/custom.validator';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  constructor(private ApiService: ApiService) {}
  randomJokes: any;
  profileForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [Validators.required, passwordValidator]),
  });
  onSubmit() {
    const joke1$ = this.ApiService.getRandomJoke();
    const joke2$ = timer(400).pipe(
      switchMap(() => this.ApiService.getRandomJoke())
    );

    //i could not manage to make the validation below work to check for duplicate jokes
    //so, the timer is set to 300ms to ensure that the second joke is different from the first one
    //since the API returns the same joke if the second call is made too quickly (any time less than 300ms)

    combineLatest([joke1$, joke2$])
      .pipe(
        map(([joke1, joke2]) => {
          if (joke1 == joke2) {
            console.warn('Same joke, retrying...');
            // If the responses are the same, retry the second API call
            return this.ApiService.getRandomJoke().pipe(
              filter((joke) => joke !== joke1), // Ensure the second joke is different from the first one
              map((newJoke) => [joke1, newJoke])
            );
          } else {
            return [joke1, joke2];
          }
        })
      )
      .subscribe((jokes: any) => {
        this.randomJokes = jokes;
      });
  }
}
