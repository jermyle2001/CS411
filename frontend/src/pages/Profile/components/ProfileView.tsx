import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { confirmDialog } from 'primereact/confirmdialog';

import api from '../../../api/api';
import { PageProps } from '../../../Pages';

export default function ProfileView({ toast, profile }: PageProps) {
  if (!profile) return <></>;
  const navigate = useNavigate();
  const [checked, setChecked] = useState(profile.save_history);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  function handleSaveHistoryChange(target: boolean) {
    setToggleLoading(true);
    api
      .post_set_save_hist(target)
      .then((success) => {
        if (success) {
          toast.current?.show({ severity: 'success', summary: 'Save History Updated' });
        } else {
          toast.current?.show({ severity: 'error', summary: 'Failed to toggle save history', detail: 'Are you logged in?' });
          setChecked(!target);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to update Save History',
          detail: `${error.message}. Try again later`,
        });
        setChecked(!target);
      })
      .finally(() => setToggleLoading(false));
  }

  function delete_account() {
    setDelLoading(true);
    api
      .post_del_account()
      .then((success) => {
        if (success) {
          toast.current?.show({ severity: 'success', summary: 'Account Deleted' });
          navigate('/signup');
        } else {
          toast.current?.show({ severity: 'error', summary: 'Failed to delete account', detail: 'Are you logged in?' });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to delete account',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setDelLoading(false));
  }

  return (
    <>
      <p>
        <b>First Name: </b> {profile.first_name}
      </p>
      <p>
        <b>Last Name: </b> {profile.last_name}
      </p>
      <p>
        <b>Email Address: </b> {profile.email_addr}
      </p>
      <Divider />
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <p style={{ marginRight: '0.5rem' }}>
          <b>Save History: </b>
        </p>
        <InputSwitch
          disabled={toggleLoading}
          checked={checked}
          onChange={(e) => {
            setChecked(e.value);
            handleSaveHistoryChange(e.value);
          }}
        />
      </div>
      <Divider />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
        <Button
          icon={PrimeIcons.TRASH}
          severity="danger"
          onClick={() => {
            confirmDialog({
              header: 'Delete Account ',
              message: 'Are you sure you want to delete your account?',
              accept: delete_account,
            });
          }}
          loading={delLoading}
        >
          Delete Account
        </Button>
      </div>
    </>
  );
}
