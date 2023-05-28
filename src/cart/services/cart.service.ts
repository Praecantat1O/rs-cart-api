import { Inject, Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem } from '../models';
import { PG_CONNECTION } from 'src/constants';
import { Client } from 'pg';

@Injectable()
export class CartService {
  constructor(@Inject(PG_CONNECTION) private connection: Client) {}

  async findByUserId(userId: string): Promise<Cart> {
    console.log('userId: ', userId);
    const cart = await this.connection.query(`SELECT * from carts WHERE user_id='${userId}'`);
    console.log('CART: ', cart);

    const cartId = cart.rows[0]?.id || undefined;

    if (!cartId) {
      return;
    }

    const items = await this.connection.query(`SELECT * FROM cart_items WHERE cart_id='${cartId}'`)
    console.log('ITEMS: ', items);

    const cartItems = items.rows.map((item, index) => <CartItem>{
      product: { id: item.product_id, description: `Description ${index}`, price: 3+index, title: `Title ${index}`},
      count: item.count,
    })

    const result: Cart = {id: cartId, items: cartItems };

    return result;
  }

  async createByUserId(userId: string): Promise<Cart> {
    const cartId = v4(v4());
    const date = new Date().toISOString();

    await this.connection.query(`
      INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
      ('${cartId}', '${userId}', '${date}', '${date}', 'OPEN')
    `)

    return <Cart>{id: cartId, items: []};
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (!!userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);

    await this.connection.query(`
      DELETE FROM cart_items WHERE cart_id='${cartId}'
    `)

    items.forEach(async (item) => {
      await this.connection.query(`
        INSERT INTO cart_items (cart_id, product_id, count) VALUES
        ('${cartId}', '${item.product.id}', '${item.count}')
      `)
    })

    return <Cart>{ id: cartId, items };
  }

  async removeByUserId(userId): Promise<void> {
    const cartId = (await this.findByUserId(userId)).id;

    await this.connection.query(`
      DELETE FROM carts WHERE user_id='${userId}'
    `)

    await this.connection.query(`
      DELETE FROM cart_items WHERE cart_id='${cartId}'
    `)
  }

}
