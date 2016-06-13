import {Page} from 'ionic-angular';
import {ControlGroup, AbstractControl, FormBuilder, Validators} from "@angular/common";

@Page({
  templateUrl: 'build/pages/coffee-coin/coffee-coin.html'
})
export class CoffeeCoin {

  coffeeCoinForm: ControlGroup;
  coinValue: AbstractControl;
  amount: AbstractControl;

  constructor(private FormBuilder: FormBuilder) {
    this.coffeeCoinForm = FormBuilder.group({
      'coinValue': ['10', Validators.compose([Validators.required])],
      'amount': ['10', Validators.compose([Validators.required])]
    });
    this.coinValue = this.coffeeCoinForm.controls['coinValue'];
    this.amount = this.coffeeCoinForm.controls['amount'];
  }

  generateCoffeeCoins(formData) {
    window.location.href = "/api/coffee-coins/generate?coinValue=" + formData.coinValue + "&amount=" + formData.amount;
  }
}

