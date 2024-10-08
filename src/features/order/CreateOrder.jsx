import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import {clearCart, getCart, getTotalCartPrice} from "../cart/cartSlice"
import EmptyCart from "../cart/EmptyCart"
import store from "../../store"
import {formatCurrency} from "../../utils/helpers"

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );


function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
  const totalPrice = totalCartPrice + priorityPrice

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData();
  const username = useSelector(state => state.user.username)

  if(!cart.length) return <EmptyCart />

  return (
    <div className='px-4 py-6'>
      <h2 className='text-xl mb-8 font-semibold' >Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className='mb-5 flex flex-col sm:flex-row gap-2 sm:items-center'>
          <label className='sm:basis-40'>First Name</label>
          <input type="text" name="customer" className='input grow' defaultValue={username} required />
        </div>

        <div className='mb-5 flex flex-col sm:flex-row gap-2 sm:items-center'>
          <label className='sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input type="tel" name="phone" className='input w-full' required />
            {formErrors?.phone && <p className='text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md'>{formErrors.phone}</p>}
          </div>

          
        </div>

        <div className='mb-5 flex flex-col sm:flex-row gap-2 sm:items-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              type="text"
              name="address"
              className="input w-full"
              required
            />
          </div>
        </div>

        <div className='mb-12 flex items-center gap-5'>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className='h-6 w-6 accent-yellow-400 focus:outline-none
              focus:ring focus:ring-yellow-400 focus:ring-offset-2'
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className='font-medium' htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <input type="hidden" name="cart" value={JSON.stringify(cart)} />

        <div>
          <Button
            disabled={isSubmitting}
            type="primary"
          >
            {isSubmitting ? 'Placing Order' : `Order now for ${formatCurrency(totalPrice)}` }
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you';

  if (Object.keys(errors).length > 0) return errors;

  // if everything is okay, create new order and redirect
  const newOrder = await createOrder(order);
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
