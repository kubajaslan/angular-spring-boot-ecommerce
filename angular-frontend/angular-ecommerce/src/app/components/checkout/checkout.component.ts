import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { EcommerceValidators } from 'src/app/validators/ecommerce-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];

  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails()

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data
      }
    )

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.email, EcommerceValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace, EcommerceValidators.zipCodeValidator])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace, EcommerceValidators.zipCodeValidator])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), EcommerceValidators.notOnlyWhitespace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), EcommerceValidators.notOnlyWhitespace]),
        expiryMonth: new FormControl('', [Validators.required]),
        expiryYear: new FormControl('', [Validators.required])
      })
    })

    const startMonth: number = new Date().getMonth() + 1;

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => { this.creditCardMonths = data; }
    );

    this.formService.getCreditCardYears().subscribe(
      data => { this.creditCardYears = data; }
    );

  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    let purchase: Purchase = new Purchase();
    purchase.order = order
    purchase.orderItems = orderItems

    purchase.customer = this.checkoutFormGroup.controls['customer'].value


    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value
    const state: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const country: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = state.name
    purchase.shippingAddress.country = country.name

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = state.name
    purchase.billingAddress.country = country.name

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert('Your order has been received.\nOrder tracking number: ' + response.orderTrackingNumber)
          this.reserCart();
        },
        error: err=> {
          alert(`There has been an error: ${err.message}`)
        }
      }
    )
  }
  reserCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0)
    this.cartService.totalQuantity.next(0)

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }


  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();

    const selectedYear = Number(creditCardFormGroup.value.expiryYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }


  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code

    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data
        } else {
          this.billingAddressStates = data
        }

        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => { this.totalQuantity = data }
    )

    this.cartService.totalPrice.subscribe(
      data => { this.totalPrice = data }
    )
  }

  
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardName() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpiryMonth() { return this.checkoutFormGroup.get('creditCard.expiryMonth'); }
  get creditCardExpiryYear() { return this.checkoutFormGroup.get('creditCard.expiryYear'); }

}


