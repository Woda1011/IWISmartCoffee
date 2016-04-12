import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/coffee-coin/coffee-coin.html'
})
export class CoffeeCoin {

  generateCoffeeCoins(){
    alert("Kaffee für alle!");
  }
}
