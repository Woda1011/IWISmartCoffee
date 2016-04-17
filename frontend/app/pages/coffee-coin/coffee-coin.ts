import {Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/coffee-coin/coffee-coin.html'
})
export class CoffeeCoin {

  generateCoffeeCoins(){
    window.location.href = "/api/coffee-coins/generate?coinValue=5&amount=10";
  }
}
