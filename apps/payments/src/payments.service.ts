import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto, NOTIFICATATIONS_SEVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATATIONS_SEVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    this.notificationsService.emit('notify_email', { email });

    return await this.stripe.paymentIntents.create({
      amount: amount * 100,

      confirm: true,

      currency: 'usd',

      payment_method: 'pm_card_visa',

      automatic_payment_methods: {
        allow_redirects: 'never',

        enabled: true,
      },
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
