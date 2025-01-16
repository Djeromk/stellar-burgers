import { ProfileUI } from '@ui-pages';
import { TUser } from '@utils-types';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectUserData, updateUser } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });
  let isFormChanged =
    formValue.name !== userData?.name ||
    formValue.email !== userData?.email ||
    !!formValue.password;

  let updateUserError = '';

  useEffect(() => {
    if (userData) {
      setFormValue((prevState) => ({
        ...prevState,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(updateUser(formValue))
      .then((res) => {
        setFormValue({
          name: (res.payload as any).user?.name,
          email: (res.payload as any).user?.email,
          password: ''
        });
      })
      .catch((err) => (updateUserError = err));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError}
    />
  );

  return null;
};
