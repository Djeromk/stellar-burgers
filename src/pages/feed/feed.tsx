import { Preloader } from '@ui';
import { useEffect } from 'react';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getFeeds, selectFeed } from '../../services/slices/feed-slice';
import { useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const { isLoading, orders } = useSelector(selectFeed);
  /** TODO: взять переменную из стора */

  if (!orders.length) {
    return <Preloader />;
  }
  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
      )}
    </>
  );
};
