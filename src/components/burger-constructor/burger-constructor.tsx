import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  createOrder,
  resetOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/order-slice';
import { useNavigate } from 'react-router-dom';
import {
  resetConstructor,
  selectBuilder
} from '../../services/slices/constructor-slice';
import { selectIsAuth } from '../../services/slices/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const orderModalData = useSelector(selectOrderModalData);
  const isAuth = useSelector(selectIsAuth);
  const orderRequest = useSelector(selectOrderRequest);
  const constructorItems = useSelector(selectBuilder);
  const navigate = useNavigate();

  const onOrderClick = () => {
    console.log(isAuth);

    if (!isAuth) {
      console.log('NAVIGATE TO LOGIN');

      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const data = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(data)).then(() => {
      dispatch(resetConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
